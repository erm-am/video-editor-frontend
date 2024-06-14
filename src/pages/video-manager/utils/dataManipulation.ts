import { v4 } from 'uuid';
import { InsertMediaOptions, LibraryElement, Media, MediaContainerType, ReorderOptions, TimelineElement, VideoMedia } from '../types';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';

// Cоздание нового элемента для Timeline на основе любого Media элемента
export const createTimelineMediaItem = ({
  media,
  offset,
}: {
  media: LibraryElement | TimelineElement;
  offset: number;
}): TimelineElement => {
  if (media.container === MediaContainerType.MEDIA_LIBRARY) {
    return { ...media, offset, localId: v4(), container: MediaContainerType.TIMELINE };
  } else if (media.container === MediaContainerType.TIMELINE) {
    return { ...media, offset, container: MediaContainerType.TIMELINE };
  }
};

// Cоздание нового элемента для MediaLibrary на основе любого Media элемента
export const createLibraryMediaItem = <T = VideoMedia>(mediaItem: Media, index: number): LibraryElement & T => {
  return { ...mediaItem, index, container: MediaContainerType.MEDIA_LIBRARY, changedValues: { duration: { left: 0, right: 0 } } };
};

// Cоздание нескольких MediaLibrary элементов на основе любых Media элементов
export const createLibraryMediaItems = (mediaItems: Media[]): LibraryElement[] => {
  return mediaItems.map((mediaItem, index) => createLibraryMediaItem(mediaItem, index));
};

// Берем только необходимые данные
export const extractData = (eventPayload) => {
  const [topTarget] = eventPayload.location.current.dropTargets;
  const source = {
    data: eventPayload?.source?.data ?? {},
    element: eventPayload?.source?.element ?? {},
  };
  const targets = {
    timeline: eventPayload.location.current.dropTargets.find((item) => !item.data?.type && item.data?.container === 'TIMELINE') ?? {},
    media: eventPayload.location.current.dropTargets.find((item) => item.data?.type && item.data?.container === 'TIMELINE') ?? {},
  };
  const edgePosition = targets.media?.data ? extractClosestEdge(targets.media.data) : null;
  const inputs = {
    initial: eventPayload.location.initial.input,
    current: eventPayload.location.current.input,
  };

  return {
    source,
    target: topTarget,
    targets,
    edgePosition,
    inputs,
    isMovingToRight: inputs.current.clientX > inputs.initial.clientX,
  };
};

// Добавить новый элемент в массив по индексу
const insertElement = (array, index, element) => array.toSpliced(index, 0, element);

// Перестановка элемента по индексу (в завсиимости от edge-line-position и направления)
export const reorderElement = (options: ReorderOptions) => {
  const { items, fromIndex, toIndex, edgePosition, isMovingToRight } = options;
  const result = Array.from(items);
  const [removed] = result.splice(fromIndex, 1);
  const replaced = items[toIndex];
  if (isMovingToRight && edgePosition === 'left') {
    const reordered = result.toSpliced(toIndex - 1, 0, { ...removed, offset: replaced.offset - removed.size });
    return reordered;
  } else if (isMovingToRight && edgePosition === 'right') {
    const reordered = result.toSpliced(toIndex, 0, { ...removed, offset: replaced.offset + replaced.size });
    return reordered;
  } else if (!isMovingToRight && edgePosition === 'left') {
    const reordered = result.toSpliced(toIndex, 0, { ...removed, offset: replaced.offset - removed.size });
    return reordered;
  } else if (!isMovingToRight && edgePosition === 'right') {
    const reordered = result.toSpliced(toIndex + 1, 0, { ...removed, offset: replaced.offset + replaced.size });
    return reordered;
  }
};

// Вставка нового элемента
export const insertMediaElement = <T>(options: InsertMediaOptions<T>) => {
  // todo types
  const { items, targetIndex, edgePosition, insertedMediaItem } = options as any;
  if (edgePosition === 'left') {
    const currentOffset = (items[targetIndex] as any).offset - insertedMediaItem.duration;
    const createdTimelineMediaItem = createTimelineMediaItem({ media: insertedMediaItem, offset: currentOffset });
    const result = insertElement(items, targetIndex, createdTimelineMediaItem);

    return result;
  }
  if (edgePosition === 'right') {
    const leftItemDuration = (items[targetIndex] as any).size + items[targetIndex].offset;
    const createdTimelineMediaItem = createTimelineMediaItem({ media: insertedMediaItem, offset: leftItemDuration });
    const result = insertElement(items, targetIndex + 1, createdTimelineMediaItem);
    return result;
  }
  return items;
};

// Расположение элемента относительно соседних элементов
export const getElementPosition = ({ from, to, edgePosition }) => {
  const isTargetAfterSource = from.index === (to.index as number) - 1;
  const isTargetBeforeSource = from.index === (to.index as number) + 1;
  const isSelf = from.index === to.index;
  const isNear = (isTargetBeforeSource && edgePosition === 'right') || (isTargetAfterSource && edgePosition === 'left');
  return { isTargetAfterSource, isTargetBeforeSource, isSelf, isNear };
};

export const getDragRoute = ({ source, target }) => {
  // Перевод "dnd-роута" в текстовое представление
  const from = [source?.data?.container, source?.data?.type].filter(Boolean).join('.');
  const to = [target?.data?.container, target?.data?.type].filter(Boolean).join('.');
  return { from, to };
};
