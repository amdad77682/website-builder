import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import PublicGalleryUploader from './common/GallaryUploader';

interface GalleryProps {
  content: any;
  handleUpdateBlock: (content: { mediaIds: string[] }) => void;
}

const Gallery: React.FC<GalleryProps> = ({ content, handleUpdateBlock }) => {
  const [gallaryModalOpen, setgallaryModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const handleSelectedImages = (image: string) => {
    console.log('Selected image:', image);
    setSelectedImages(images => [...images, image]);
    setgallaryModalOpen(false);
    handleUpdateBlock({ mediaIds: [...selectedImages, image] });
  };
  useEffect(() => {
    if (content) {
      setSelectedImages(content?.mediaIds || []);
    }
  }, [content]);

  return (
    <div>
      <div className="w-full p-4">
        {/* Left side content */}
        <div className="bg-[#777674] p-4 flex items-center justify-center min-h-[400px]">
          <PublicGalleryUploader
            gallaryModalOpen={gallaryModalOpen}
            setgallaryModalOpen={setgallaryModalOpen}
            handleSelectedImages={handleSelectedImages}
          >
            {Array.isArray(selectedImages) && selectedImages.length > 0 ? (
              <div className="grid grid-cols-3 gap-4 overflow-y-scroll">
                {selectedImages.map(item => {
                  return (
                    <img
                      key={item}
                      src={item}
                      alt="Selected"
                      className="max-h-72 object-contain"
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center flex flex-col items-center gap-2">
                <Plus />
                <p className="text-white">
                  Click to to upload or drag and drop
                </p>
                <p>
                  Supports JPG, PNG, SVG, PSD, and more. Maximum file size: 50
                  MB.
                </p>
              </div>
            )}
          </PublicGalleryUploader>
        </div>
        <PublicGalleryUploader
          gallaryModalOpen={gallaryModalOpen}
          setgallaryModalOpen={setgallaryModalOpen}
          handleSelectedImages={handleSelectedImages}
        >
          <div className="flex justify-center ">
            <button
              onClick={() => setgallaryModalOpen(true)}
              className="mt-4 bg-[#F5F3F3] text-gray-800 rounded-full px-4 py-2 flex items-center gap-2"
            >
              Add More Images
            </button>
          </div>
        </PublicGalleryUploader>
      </div>
    </div>
  );
};

export default Gallery;
