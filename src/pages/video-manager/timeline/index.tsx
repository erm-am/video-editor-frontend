import React, { useRef } from 'react';
import styled from '@emotion/styled';
import { VideoTimelineElement } from './video';
import { useTimeline } from './useTimeline';

export const Timeline = () => {
  const timelineContainerRef = useRef();
  const { mediaItems, selectedId, removeMediaItem, selectMediaItem } = useTimeline({
    timelineContainerRef,
  });
  return (
    <TimelineContainer ref={timelineContainerRef}>
      {mediaItems.map((media, index) => {
        const isActive = media.localId === selectedId;
        if (media.type === 'VIDEO') {
          return (
            <VideoTimelineElement
              isActive={isActive}
              key={media.localId}
              index={index}
              media={media}
              onRemove={removeMediaItem}
              onSelect={selectMediaItem}
            />
          );
        }
        return <div>UNKNOWN_MEDIA_ELEMENT</div>;
      })}
    </TimelineContainer>
  );
};

const TimelineContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 800px;
  height: 400px;
  overflow: auto;
  background-color: #0e1317;
  position: relative;
`;
