import { v4 } from 'uuid';

import { BaseEventPayload, ElementDragType, Input } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';
import { Collision, DragDataPayload, ReorderOptions, TimelineElement } from './types';
import { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/dist/types/types';

// Todo types (!)

export const createTimelineElement = (element): TimelineElement => ({ ...element, localId: v4(), container: 'timeline' });
export const createRootContainerData = (data) => ({ ...data, container: 'root' });
export const createTimelineContainerData = (data) => ({ ...data, container: 'timeline' });
export const insertElement = (array, index, element) => array.toSpliced(index, 0, element);

export const applyLevel = (level: number = 0, edgePosition: Edge) => {
  // Переход на следующий уровень в зависимости от положения Edge
  if (edgePosition === 'top') return level - 1;
  if (edgePosition === 'bottom') return level + 1;
  return level;
};

export const extractPayloadDragData = (eventPayload: BaseEventPayload<ElementDragType>): DragDataPayload => {
  // Получение данных из drag-event
  const [topDropTarget] = eventPayload.location.current.dropTargets;
  const source = {
    data: eventPayload?.source?.data ?? {},
    element: eventPayload?.source?.element ?? {},
  };
  const targets = {
    timeline: eventPayload.location.current.dropTargets.find((item) => !item.data?.type && item.data?.container === 'timeline') ?? {},
    media: eventPayload.location.current.dropTargets.find((item) => item.data?.type && item.data?.container === 'timeline') ?? {},
    library: eventPayload.location.current.dropTargets.find((item) => item.data?.type && item.data?.container === 'library') ?? {},
    root: eventPayload.location.current.dropTargets.find((item) => !item.data?.type && item.data?.container === 'root') ?? {},
  };
  const inputs = {
    initial: eventPayload.location.initial.input,
    current: eventPayload.location.current.input,
  };
  const edgePosition = getCoordinates(topDropTarget.data as { element: Element; input: Input });

  return {
    source,
    target: topDropTarget,
    targets,
    edgePosition,
    inputs,
    isMovingToRight: inputs.current.clientX > inputs.initial.clientX,
  };
};

export const getElementPosition = ({ from, to, edgePosition }) => {
  // Расположение элемента относительно соседних элементов
  const isTargetAfterSource = from.index === (to.index as number) - 1;
  const isTargetBeforeSource = from.index === (to.index as number) + 1;
  const isSelf = from.index === to.index;
  const isNear = (isTargetBeforeSource && edgePosition === 'right') || (isTargetAfterSource && edgePosition === 'left');
  return { isTargetAfterSource, isTargetBeforeSource, isSelf, isNear };
};

export const getDragRoute = ({ source, target }) => {
  // Конвертация "dnd-роута" в текстовое представление
  const from = [source?.data?.container, source?.data?.type, source?.data?.action].filter(Boolean).join('.');
  const to = [target?.data?.container, target?.data?.type, target?.data?.action].filter(Boolean).join('.');
  return { from, to };
};

export const getEdgePosition = (coordinates: { horizontal: number; vertical: number }): Edge => {
  // Алгоритм отображения позиции линии
  // Игнорируем пересечения на углах
  const { horizontal, vertical } = coordinates;
  const isTop = vertical > 95;
  const isBottom = vertical < 5;
  const isRight = horizontal > 95;
  const isLeft = horizontal < 5;
  if (isRight && !isTop && !isBottom) return 'right';
  if (isLeft && !isTop && !isBottom) return 'left';
  if (isTop && !isLeft && !isRight) return 'top';
  if (isBottom && !isLeft && !isRight) return 'bottom';
};

export const getCoordinates = (data: { element: Element; input: Input }) => {
  // Получаем координаты в процентном соотношении + текущую позицию
  const element = data.element;
  const input = data.input;
  const rect = element.getBoundingClientRect();
  const client = {
    x: input.clientX,
    y: input.clientY,
  };
  const vertical = Math.round(100 / (rect.height / Math.abs(rect.bottom - client.y)));
  const horizontal = Math.round(100 / (rect.width / Math.abs(client.x - rect.left)));
  const position = getEdgePosition({ vertical, horizontal });
  return {
    position,
    vertical,
    horizontal,
  };
};

const detectOutOfBounds = (elements) => {
  // Формирование списка коллизий (пересечения границы контейнера)
  let collisions = [];
  if (elements.at(0).params.offset < 0) {
    collisions.push({ type: 'out_of_bounds', indexes: [0, -1] });
  }
  return collisions;
};
const detectRectangleIntersection = (elements) => {
  // Формирование списка коллизий (пересечения границы прямоугольника)
  let collisions = [];
  for (let i = 0; i < elements.length - 1; i++) {
    let currentElementEnd = elements[i].params.offset + elements[i].params.width;
    let nextElementStart = elements[i + 1].params.offset;
    if (currentElementEnd > nextElementStart) {
      collisions.push({ type: 'rectangle_intersection', indexes: [i, i + 1] });
    }
  }
  return collisions;
};

const detectCollisions = (elements): Collision[] => {
  // Поиск коллизий
  return [...detectOutOfBounds(elements), ...detectRectangleIntersection(elements)];
};

export const resolveCollisions = ({ elements, isMovingToRight }) => {
  // Если найдены коллизии, то делаем перерасчет позиций
  let collisions = detectCollisions(elements);
  while (collisions.length > 0) {
    for (const collision of collisions) {
      const [leftElementIndex, rightElementIndex] = collision.indexes;
      if (collision.type == 'out_of_bounds') {
        elements[leftElementIndex].params.offset = 0; // Возвращаем элемент в начало
        isMovingToRight = true; // Меняем направление "волны" (проверяем коллизии в противоположную сторону)
      } else if (collision.type === 'rectangle_intersection') {
        const nextElementStartOffset = elements[rightElementIndex].params.offset;
        const currentElementEndOffset = elements[leftElementIndex].params.offset + elements[leftElementIndex].params.width;

        if (isMovingToRight) {
          elements[rightElementIndex].params.offset = currentElementEndOffset;
        } else {
          elements[leftElementIndex].params.offset = nextElementStartOffset - elements[leftElementIndex].params.width;
        }
      }
    }
    collisions = detectCollisions(elements);
  }
  return elements;
};

export const recalculate = ({
  elements,
  isMovingToRight,
  reindexMode,
}: {
  elements: TimelineElement[];
  isMovingToRight: boolean;
  reindexMode: 'after' | 'before';
}) => {
  // Пересчет offset и index всех элементов
  if (reindexMode === 'after') return reindex({ elements: resolveCollisions({ elements, isMovingToRight }) });
  if (reindexMode === 'before') return resolveCollisions({ elements: reindex({ elements }), isMovingToRight });
};

export const reindex = ({ elements }) => {
  // Переиндексация элементов
  return elements.toSorted((a, b) => a.params.offset - b.params.offset).map((element, index) => ({ ...element, index }));
};

export const reorderElement = (options: ReorderOptions) => {
  // Переупорядочить элемент (зависит от направления и позиции края)

  // 1. Удаление элемента по индексу fromIndex
  // 2. Перемещение элемента слева или справа от toIndex
  // 3. Расчет offset перемещеного элемента (зависит от направления и позиции)

  const { elements, fromIndex, toIndex, edgePosition, isMovingToRight } = options;
  const result = Array.from(elements);
  const [removed] = result.splice(fromIndex, 1);
  const replaced = elements[toIndex];
  if (isMovingToRight && edgePosition === 'left') {
    const reordered = result.toSpliced(toIndex - 1, 0, {
      ...removed,
      params: {
        ...removed.params,
        offset: replaced.params.offset - removed.params.width,
      },
    });
    return reordered;
  } else if (isMovingToRight && edgePosition === 'right') {
    const reordered = result.toSpliced(toIndex, 0, {
      ...removed,
      params: { ...removed.params, offset: replaced.params.offset + replaced.params.width },
    });
    return reordered;
  } else if (!isMovingToRight && edgePosition === 'left') {
    const reordered = result.toSpliced(toIndex, 0, {
      ...removed,
      params: { ...removed.params, offset: replaced.params.offset - removed.params.width },
    });
    return reordered;
  } else if (!isMovingToRight && edgePosition === 'right') {
    const reordered = result.toSpliced(toIndex + 1, 0, {
      ...removed,
      params: { ...removed.params, offset: replaced.params.offset + replaced.params.width },
    });
    return reordered;
  }
};

export const calculateOffsetFromContainerStart = ({ source, target, inputs }) => {
  // Вычислить смещение от начала контейнера
  // Используется в случае, когда переносим элемент из Library в Timeline
  const sourceLeft = source?.element.getBoundingClientRect().left;
  const targetLeft = target?.element.getBoundingClientRect().left;
  const currentX = inputs.current.clientX;
  const initialX = inputs.initial.clientX;
  const moveDistance = currentX - initialX;
  const offset = moveDistance + (sourceLeft - targetLeft);
  return offset;
};
