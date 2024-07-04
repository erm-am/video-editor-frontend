// resizeLeft: ({ source, inputs, isMovingToRight }) => {
//   set((state) => {
//     const moveDistance = inputs.initial.clientX - inputs.current.clientX;

//     const updatedTimelineMediaItems = state.mediaItems.map((timelineMediaItem: any & any) => {
//       if (timelineMediaItem.localId !== source.data.localId) {
//         return timelineMediaItem;
//       }
//       const { left, right } = timelineMediaItem.changedValues.duration;
//       const updatedOffset = timelineMediaItem.offset - moveDistance;
//       return {
//         ...timelineMediaItem,
//         changedValues: {
//           ...timelineMediaItem.changedValues,
//           duration: { left: left + moveDistance, right },
//         },
//         offset: updatedOffset,
//       };
//     });
//     return {
//       mediaItems: recalculate({ items: updatedTimelineMediaItems, isMovingToRight, reindexMode: 'before' }),
//     };
//   });
//   return source.data.localId;
// },
// resizeRight: ({ source, inputs, isMovingToRight }) => {
//   set((state) => {
//     const updatedTimelineMediaItems = state.mediaItems.map((timelineMediaItem: any & any) => {
//       const { left, right } = timelineMediaItem.changedValues.duration;
//       const moveDistance = (inputs.initial.clientX - inputs.current.clientX) * -1;
//       return timelineMediaItem.localId === source.data.localId
//         ? {
//             ...timelineMediaItem,
//             changedValues: {
//               ...timelineMediaItem.changedValues,
//               duration: { left, right: right + moveDistance },
//             },
//           }
//         : timelineMediaItem;
//     });
//     return {
//       mediaItems: recalculate({ items: updatedTimelineMediaItems, isMovingToRight, reindexMode: 'before' }),
//     };
//   });
//   return source.data.localId;
// },

//  if (
//   currentDragRoute.from === 'TIMELINE.VIDEO.LEFT' &&
//   (currentDragRoute.to === 'TIMELINE' || currentDragRoute.to === 'TIMELINE.VIDEO')
// ) {
//   timelineStore.resizeLeft({ source, inputs, isMovingToRight });
// } else if (
//   currentDragRoute.from === 'TIMELINE.VIDEO.RIGHT' &&
//   (currentDragRoute.to === 'TIMELINE' || currentDragRoute.to === 'TIMELINE.VIDEO')
// ) {
//   timelineStore.resizeRight({ source, inputs, isMovingToRight });
// }
