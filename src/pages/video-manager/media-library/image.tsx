import React from 'react';
import { ImageMedia, LibraryElement, VideoMedia } from '../types';

type ImageLibraryElementProps = {
  media: ImageMedia & LibraryElement;
};
export const ImageLibraryElement: React.FC<ImageLibraryElementProps> = ({ media }) => {
  return <div>todo</div>;
};
