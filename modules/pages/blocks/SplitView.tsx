import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import MinimalArticleEditor from './common/ArticleEditor';
import PublicGalleryUploader from './common/GallaryUploader';

interface SplitViewProps {
  content: any;
  handleUpdateBlock: (content: {
    mediaIds?: string[];
    text?: string;
    placeholder?: string;
  }) => void;
}

const SplitView: React.FC<SplitViewProps> = ({
  content,
  handleUpdateBlock,
}) => {
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
      setSelectedImages(content?.mediaIds);
    }
  }, [content]);

  const handleContentChange = (content: {
    text: string;
    placeholder: string;
  }) => {
    handleUpdateBlock({ text: content.text, placeholder: content.placeholder });
  };
  return (
    <div className="flex ">
      <div className="w-1/2 p-4">
        {/* Left side content */}
        <PublicGalleryUploader
          gallaryModalOpen={gallaryModalOpen}
          setgallaryModalOpen={setgallaryModalOpen}
          handleSelectedImages={handleSelectedImages}
        >
          {Array.isArray(selectedImages) && selectedImages.length > 0 ? (
            <div className="">
              {selectedImages.map(item => {
                return (
                  <img
                    key={item}
                    src={item}
                    alt="Selected"
                    className="object-contain"
                  />
                );
              })}
            </div>
          ) : (
            <div className="bg-[#777674] p-4 flex items-center justify-center h-[300px]">
              <div className="text-center flex flex-col items-center gap-2">
                <Plus />
                <p className="text-white">
                  Click to to upload or drag and drop
                </p>
                <p>Maximum file size: 50 MB.</p>
              </div>
            </div>
          )}
        </PublicGalleryUploader>
      </div>
      <div className="w-1/2 p-4">
        <MinimalArticleEditor
          text={content?.text || ''}
          placeholder={content?.right?.placeholder || ''}
          onContentChange={handleContentChange}
        />
      </div>
    </div>
  );
};

export default SplitView;
