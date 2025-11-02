import {
  ALargeSmall,
  Camera,
  Images,
  SquareSplitHorizontal,
} from 'lucide-react';

export const DESIGNS = [
  {
    type: 'video',
    name: 'Video ',
    icon: <Camera />,
    layout: 'full',
    content: {
      mediaId: 'https://www.w3schools.com/html/mov_bbb.mp4',
    },
  },
  {
    type: 'text',
    name: 'Text ',
    icon: <ALargeSmall />,
    placehoder: 'Enter your text here...',
    layout: 'full',
    content: {
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac vulputate dolor. Suspendisse potenti.',
    },
  },

  {
    type: 'split',
    name: 'Split View',
    icon: <SquareSplitHorizontal />,
    layout: 'split',
    content: {
      right: {
        type: 'text',
        text: 'Pellentesque est ex, posuere non dapibus in, ullamcorper vitae nibh. Vestibulum euismod, nibh eget facilisis tristique, tellus justo aliquam tellus, vitae lobortis augue lectus sit amet felis. Cras vehicula vel risus consequat interdum. Ut egestas commodo egestas. Duis cursus pretium tempor. Proin hendrerit, enim ut eleifend vulputate, ex mi iaculis nunc, ac feugiat mi tortor nec leo. Aliquam laoreet odio quis dui viverra lobortis. Sed dictum malesuada nisi ac pretium. Integer venenatis posuere libero nec cursus. Curabitur vitae erat ligula. Duis in auctor nisl, accumsan gravida libero. Vestibulum vitae urna diam. Sed egestas erat interdum nisl cursus, in dictum urna tincidunt. In dui enim, ullamcorper quis facilisis quis, dignissim in tortor.',
      },
      left: {
        type: 'gallery',
        mediaId: 'https://via.placeholder.com/400x400',
      },
    },
  },
  {
    type: 'gallery',
    name: 'Gallery ',
    icon: <Images />,
    layout: 'full',
    content: {
      mediaId: 'https://via.placeholder.com/800x400',
    },
  },
];
