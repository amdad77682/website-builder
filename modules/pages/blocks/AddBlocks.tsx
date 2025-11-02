'use client';
import { DESIGNS } from '@/modules/contants';
import { createBlocks } from '@/services/blocksService';
import { useBlockStore } from '@/store/blocks';
import { Popover } from 'antd';
import { useParams } from 'next/navigation';
import { useState } from 'react';

interface AddBlocksProps {}

const AddBlocks: React.FC<AddBlocksProps> = () => {
  const [openPopover, setOpenPopover] = useState(false);
  const params = useParams();
  const { addBlock } = useBlockStore();
  const content = (
    <div className="p-4 ">
      <h2>Design</h2>
      <div className="grid grid-cols-4 gap-4 mt-4">
        {DESIGNS.map((design, index) => (
          <div
            key={index}
            className="flex flex-col bg-[#F5F5F5] items-center p-4 "
            onClick={() => handleAddBlock(design)}
          >
            {design.icon}
            <h3 className="font-semibold mb-2">{design.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );

  const handleAddBlock = async (design: any) => {
    try {
      const reqBody = {
        page_id: params?.id,
        type: design.type,
        config: {
          content: design?.content,
        },
        // order_index: 0,
      };
      const response = await createBlocks(reqBody);
      if (response) {
        const newBlock = await response;
        addBlock(newBlock);
        setOpenPopover(false);
      } else {
        console.error('Failed to add block');
      }
    } catch (error) {
      console.error('Error adding block:', error);
    }
  };

  return (
    <div className="flex justify-center gap-4 py-6 bg-white">
      <Popover open={openPopover} content={content} trigger="click">
        <button
          onClick={() => setOpenPopover(true)}
          className="bg-gray-800 text-white rounded-full px-6 py-2"
        >
          + Add Block
        </button>
      </Popover>
    </div>
  );
};

export default AddBlocks;
