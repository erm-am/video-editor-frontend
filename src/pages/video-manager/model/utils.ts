import { v4 } from 'uuid';

import { BaseEventPayload, DropTargetRecord, ElementDragType, Input } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';
import { Collision, ElementParams, ExtractedPayloadDragData, TimelineElement } from './types';
import { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/dist/types/types';

export const createTimelineMediaElement = (element): TimelineElement => {
  return { ...element, localId: v4(), container: 'timeline' };
};

export const createRootContainerData = (data) => {
  return { ...data, container: 'root' };
};
export const createTimelineContainerData = (data) => {
  return { ...data, container: 'timeline' };
};

export const extractPayloadDragData = (eventPayload: BaseEventPayload<ElementDragType>): ExtractedPayloadDragData => {
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
  // const edgePosition = targets.media?.data ? extractClosestEdge(targets.media.data) : null;
  const inputs = {
    initial: eventPayload.location.initial.input,
    current: eventPayload.location.current.input,
  };

  const edgePosition = extractEdgePosition(topDropTarget.data as { element: Element; input: Input });

  return {
    source,
    target: topDropTarget,
    targets,
    edgePosition,
    inputs,
    isMovingToRight: inputs.current.clientX > inputs.initial.clientX,
  };
};

// // Расположение элемента относительно соседних элементов
export const getElementPosition = ({ from, to, edgePosition }) => {
  const isTargetAfterSource = from.index === (to.index as number) - 1;
  const isTargetBeforeSource = from.index === (to.index as number) + 1;
  const isSelf = from.index === to.index;
  const isNear = (isTargetBeforeSource && edgePosition === 'right') || (isTargetAfterSource && edgePosition === 'left');
  return { isTargetAfterSource, isTargetBeforeSource, isSelf, isNear };
};

export const getDragRoute = ({ source, target }) => {
  // Перевод "dnd-роута" в текстовое представление
  const from = [source?.data?.container, source?.data?.type, source?.data?.action].filter(Boolean).join('.');
  const to = [target?.data?.container, target?.data?.type, target?.data?.action].filter(Boolean).join('.');
  return { from, to };
};

export const unpackEdgePosition = (edgePosition: { horizontal: number; vertical: number }): 'left' | 'right' | 'top' | 'bottom' => {
  if (edgePosition.horizontal > 95 && edgePosition.vertical > 5 && edgePosition.vertical < 95) {
    return 'right';
  } else if (edgePosition.horizontal < 5 && edgePosition.vertical > 5 && edgePosition.vertical < 95) {
    return 'left';
  } else if (edgePosition.vertical > 95 && edgePosition.horizontal > 5 && edgePosition.horizontal < 95) {
    return 'top';
  } else if (edgePosition.vertical < 5 && edgePosition.horizontal > 5 && edgePosition.horizontal < 95) {
    return 'bottom';
  }
};

export const extractEdgePosition = (data: { element: Element; input: Input }) => {
  const element = data.element;
  const input = data.input;
  const rect = element.getBoundingClientRect();
  const client = {
    x: input.clientX,
    y: input.clientY,
  };

  const vertical = Math.round(100 / (rect.height / Math.abs(rect.bottom - client.y)));
  const horizontal = Math.round(100 / (rect.width / Math.abs(client.x - rect.left)));

  const position = unpackEdgePosition({ vertical, horizontal });
  return {
    position,
    vertical,
    horizontal,
  };
};

export const calculateOffsetFromContainerStart = ({ source, target, inputs }) => {
  const sourceLeft = source?.element.getBoundingClientRect().left;
  const targetLeft = target?.element.getBoundingClientRect().left;
  const currentX = inputs.current.clientX;
  const initialX = inputs.initial.clientX;
  const moveDistance = currentX - initialX;
  const offset = moveDistance + (sourceLeft - targetLeft);
  return offset;
};

const detectNegativeOffset = (elements) => {
  // Поиск коллизий (отрицательная позиция первого элемента)
  let collisions = [];
  if (elements.at(0).params.offset < 0) {
    collisions.push({ type: 'NEGATIVE_LEFT_OFFSET', indexes: [0, -1] });
  }
  return collisions;
};

const detectOverlapCollisions = (elements) => {
  // Поиск коллизий (две элемента на одной позиции)
  let collisions = [];
  for (let i = 0; i < elements.length - 1; i++) {
    let currentElementEnd = elements[i].params.offset + elements[i].params.width;
    let nextElementStart = elements[i + 1].params.offset;
    if (currentElementEnd > nextElementStart) {
      collisions.push({ type: 'OVERLAP', indexes: [i, i + 1] });
    }
  }
  return collisions;
};

const detectCollisions = (elements): Collision[] => {
  // Возвращает список коллизий
  let collisions = [...detectNegativeOffset(elements), ...detectOverlapCollisions(elements)];
  return collisions;
};

export const resolveCollisions = ({ items, isMovingToRight }) => {
  let collisions = detectCollisions(items);
  while (collisions.length > 0) {
    for (const collision of collisions) {
      const [leftIndex, rightIndex] = collision.indexes;
      if (collision.type == 'NEGATIVE_LEFT_OFFSET') {
        items[leftIndex].params.offset = 0; // Возвращаем элемент в самое начало контейнера
        isMovingToRight = true; // Меняем направление "волны" (проверяем коллизии в противоположную сторону)
      } else if (collision.type === 'OVERLAP') {
        const currentElementEnd = items[leftIndex].params.offset + items[leftIndex].params.width;
        const nextElementStart = items[rightIndex].params.offset;
        if (isMovingToRight) {
          items[rightIndex].params.offset = currentElementEnd;
        } else {
          items[leftIndex].params.offset = nextElementStart - items[leftIndex].params.width;
        }
      }
    }
    collisions = detectCollisions(items);
  }
  return items;
};

export const recalculate = ({
  items,
  isMovingToRight,
  reindexMode,
}: {
  items: (TimelineElement & {
    params: ElementParams;
  })[];
  isMovingToRight: boolean;
  reindexMode: 'after' | 'before' | string;
}) => {
  if (reindexMode === 'before') {
    return resolveCollisions({ items: recalculateIndexes(items), isMovingToRight });
  } else if (reindexMode === 'after') {
    return recalculateIndexes(resolveCollisions({ items, isMovingToRight }));
  }
};

export const recalculateIndexes = (elements) =>
  elements.toSorted((a, b) => a.params.offset - b.params.offset).map((element, index) => ({ ...element, index }));

///

export const insertElement = (array, index, element) => array.toSpliced(index, 0, element);

export type ReorderOptions = {
  items: (TimelineElement & {
    params: ElementParams;
  })[];
  fromIndex: number;
  toIndex: number;
  edgePosition: Edge;
  isMovingToRight: boolean;
};
export const reorderElement = (options: ReorderOptions) => {
  const { items, fromIndex, toIndex, edgePosition, isMovingToRight } = options;
  const result = Array.from(items);
  const [removed] = result.splice(fromIndex, 1);
  const replaced = items[toIndex];
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
