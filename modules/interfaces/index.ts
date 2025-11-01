import { JSX } from 'react';

interface BaseDesign {
  type: string;
  name: string;
  icon: JSX.Element;
  layout: 'full' | 'split';
  
}

interface VideoDesign extends BaseDesign {
  type: 'video';
  content: {
    mediaId: string;
  };
}

interface TextDesign extends BaseDesign {
  type: 'text';
  placehoder?: string; // fixed typo: should probably be "placeholder"
  content: {
    text: string;
  };
}

interface GalleryDesign extends BaseDesign {
  type: 'gallery';
  content: {
    mediaId: string;
  };
}

interface SplitViewDesign extends BaseDesign {
  type: 'split-view';
  content: {
    left: {
      type: 'text';
      text: string;
    };
    right: {
      type: 'gallery';
      mediaId: string;
    };
  };
}

export type Design = VideoDesign | TextDesign | GalleryDesign | SplitViewDesign;
