import { Collision } from '../types';

const detectNegativeOffset = (elements) => {
  // Поиск коллизий (отрицательная позиция первого элемента)
  let collisions = [];
  if (elements.at(0).offset < 0) {
    collisions.push({ type: 'NEGATIVE_LEFT_OFFSET', indexes: [0, -1] });
  }
  return collisions;
};

const detectOverlapCollisions = (elements) => {
  // Поиск коллизий (две элемента на одной позиции)
  let collisions = [];
  for (let i = 0; i < elements.length - 1; i++) {
    let currentElementEnd = elements[i].offset + elements[i].size;
    let nextElementStart = elements[i + 1].offset;
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

const resolveCollisions = ({ items, isMovingToRight }) => {
  let collisions = detectCollisions(items);
  while (collisions.length > 0) {
    for (const collision of collisions) {
      const [leftIndex, rightIndex] = collision.indexes;
      if (collision.type == 'NEGATIVE_LEFT_OFFSET') {
        items[leftIndex].offset = 0; // Возвращаем элемент в самое начало контейнера
        isMovingToRight = true; // Меняем направление "волны" (проверяем коллизии в противоположную сторону)
      } else if (collision.type === 'OVERLAP') {
        const currentElementEnd = items[leftIndex].offset + items[leftIndex].size;
        const nextElementStart = items[rightIndex].offset;
        if (isMovingToRight) {
          items[rightIndex].offset = currentElementEnd;
        } else {
          items[leftIndex].offset = nextElementStart - items[leftIndex].size;
        }
      }
    }
    collisions = detectCollisions(items);
  }
  return items;
};

export { resolveCollisions };
