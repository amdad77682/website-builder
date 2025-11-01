import { Input } from 'antd';
import { Plus } from 'lucide-react';

interface SplitViewProps {
  content: any;
}

const SplitView: React.FC<SplitViewProps> = ({ content }) => {
  return (
    <div className="flex ">
      <div className="w-1/2 p-4">
        {/* Left side content */}
        <div className="bg-[#777674] p-4 flex items-center justify-center h-[300px]">
          <div className="text-center flex flex-col items-center gap-2">
            <Plus />
            <p className="text-white">Click to to upload or drag and drop</p>
            <p>Maximum file size: 50 MB.</p>
          </div>
        </div>
      </div>
      <div className="w-1/2 p-4">
        {/* Right side content */}
        <Input.TextArea
          rows={4}
          placeholder={content?.text}
          className="bg-transparent! border-none focus:ring-0 focus:outline-none!"
        />
      </div>
    </div>
  );
};

export default SplitView;
