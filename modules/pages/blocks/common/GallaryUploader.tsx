import { Modal } from 'antd';
import React, { ReactNode } from 'react';

interface ImageData {
  url: string;
  title: string;
  source: string;
}

interface PublicGalleryUploaderProps {
  children?: ReactNode;
  gallaryModalOpen: boolean;
  setgallaryModalOpen: (open: boolean) => void;
  handleSelectedImages: (image: string) => void;
}

const PublicGalleryUploader: React.FC<PublicGalleryUploaderProps> = ({
  children,
  gallaryModalOpen,
  setgallaryModalOpen,
  handleSelectedImages,
}) => {
  // Public domain/free images from various sources
  const publicImages: ImageData[] = [
    {
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
      title: 'Mountain Landscape',
      source: 'Unsplash',
    },
    {
      url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
      title: 'Forest Path',
      source: 'Unsplash',
    },
    {
      url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
      title: 'Nature Trail',
      source: 'Unsplash',
    },
    {
      url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
      title: 'Misty Hills',
      source: 'Unsplash',
    },
    {
      url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff',
      title: 'Autumn Forest',
      source: 'Unsplash',
    },
    {
      url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e',
      title: 'Scenic View',
      source: 'Unsplash',
    },
  ];

  return (
    <>
      {children && (
        <div onClick={() => setgallaryModalOpen(true)} className="">
          {children}
        </div>
      )}
      <Modal
        open={gallaryModalOpen}
        onCancel={() => setgallaryModalOpen(false)}
        footer={null}
        width={900}
        height={600}
      >
        <div className="p-4">
          <div className="max-w-6xl mx-auto">
            {/* Public Gallery */}
            <div className="">
              <p className="text-gray-600 mb-6">
                Click on any image to add it to your selection
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {publicImages.map((image: ImageData, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectedImages(image.url)}
                    className="relative cursor-pointer group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all"
                  >
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                      <p className="text-white text-sm font-medium">
                        {image.title}
                      </p>
                      <p className="text-gray-300 text-xs">{image.source}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PublicGalleryUploader;
