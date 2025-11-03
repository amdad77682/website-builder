'use client';
import Blocks from '@/modules/pages/blocks/Blocks';
import { Preview } from '@/modules/pages/blocks/common/PreviewContainer';

import { Modal } from 'antd';
import { Eye } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';

interface CustomPageProps {}

const CustomPage: React.FC<CustomPageProps> = () => {
  const params = useParams();
  const { id } = params;
  const [isPreview, setIsPreview] = useState(false);
  const handlePreview = () => {
    setIsPreview(!isPreview);
  };
  return (
    <>
      <div className="flex-1 flex flex-col items-center justify-center bg-white">
        <div className="w-full   overflow-y-scroll " style={{ height: '83vh' }}>
          <Blocks />
        </div>
        <div className="absolute bottom-8 right-2 ">
          <button
            onClick={handlePreview}
            className="border rounded-full p-2 flex items-center gap-2 border-gray-300"
          >
            <Eye className="text-gray-500" />
            <span className="text-sm text-gray-700"> Preview</span>
          </button>
        </div>
      </div>
      <Modal width={1000} open={isPreview} onCancel={handlePreview}>
        <Preview id={id as string} />
      </Modal>
    </>
  );
};

export default CustomPage;
