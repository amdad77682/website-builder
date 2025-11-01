import { Plus } from 'lucide-react';

interface VideoBlockProps {
  content: any;
}

const VideoBlock: React.FC<VideoBlockProps> = ({ content }) => {
  return (
    <div className="bg-black w-full h-[300px] flex items-center justify-center">
      <div className="text-center flex flex-col items-center gap-2">
        <Plus />
        <p className="text-white">Click to to upload or drag and drop</p>
        <p>Maximum file size: 50 MB.</p>
      </div>
    </div>
  );
};

export default VideoBlock;
