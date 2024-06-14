import { resolveCollisions } from './collisions';

export const recalculate = ({ items, isMovingToRight, reindexMode }) => {
  if (reindexMode === 'before') {
    return resolveCollisions({ items: recalculateValues(recalculateIndexes(items)), isMovingToRight });
  } else if (reindexMode === 'after') {
    return recalculateIndexes(resolveCollisions({ items: recalculateValues(items), isMovingToRight }));
  }
};

export const recalculateIndexes = (elements) =>
  elements.toSorted((a, b) => a.offset - b.offset).map((element, index) => ({ ...element, index }));
export const recalculateValues = (elements) => {
  return elements.map((item) => {
    return { ...item, size: item.duration + item.changedValues.duration.left + item.changedValues.duration.right };
  });
};

export const calculateOffsetForMediaLibraryToTimelineDrag = ({ source, target, inputs }) => {
  const sourceLeft = source?.element.getBoundingClientRect().left;
  const targetLeft = target?.element.getBoundingClientRect().left;
  const currentX = inputs.current.clientX;
  const initialX = inputs.initial.clientX;
  const moveDistance = currentX - initialX;
  const offset = moveDistance + (sourceLeft - targetLeft);
  return offset;
};
