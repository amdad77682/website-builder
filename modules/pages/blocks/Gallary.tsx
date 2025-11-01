import { Plus } from 'lucide-react';

interface GalleryProps {
  content: any;
}

const Gallery: React.FC<GalleryProps> = ({ content }) => {
  return (
    <div>
      <div className="w-full p-4">
        {/* Left side content */}
        <div className="bg-[#777674] p-4 flex items-center justify-center h-[300px]">
          <div className="text-center flex flex-col items-center gap-2">
            <Plus />
            <p className="text-white">Click to to upload or drag and drop</p>
            <p>
              Supports JPG, PNG, SVG, PSD, and more. Maximum file size: 50 MB.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
