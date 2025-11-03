'use client';
import {
  deleteBlock as apiDeleteBlock,
  getBlocks,
  reorderBlocks,
  updateBlock,
} from '@/services/blocksService';
import { useBlockStore } from '@/store/blocks';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import useSWR from 'swr';
import Gallery from './Gallary';
import SplitView from './SplitView';
import TextBlock from './TextBlock';
import VideoBlock from './VideoBlock';
interface BlocksProps {}

const Blocks: React.FC<BlocksProps> = () => {
  const params = useParams();
  const {
    blocks,
    setBlocks,
    deleteBlock: storeDeleteBlock,
    reorderBlocks: storeReorderBlocks,
    updateBlock: storeUpdateBlock,
  } = useBlockStore();
  const { data: blockData, isLoading } = useSWR(
    params?.id ? `blocks_${params?.id}` : null,
    async () => {
      const response = await getBlocks(params?.id as string);
      return response;
    }
  );

  useEffect(() => {
    setBlocks(blockData);
  }, [blockData]);

  const moveup = (index: number) => {
    if (index === 0) return;
    const reordered = [...blocks];
    [reordered[index - 1], reordered[index]] = [
      reordered[index],
      reordered[index - 1],
    ];
    const updates = reordered.map((block, idx) => ({
      id: block.id,
      order_index: idx,
    }));
    reorderBlocks(params?.id as string, updates).then(() => {
      storeReorderBlocks(updates);
    });
  };

  const movedown = (index: number) => {
    if (index === blocks.length - 1) return;
    const reordered = [...blocks];
    [reordered[index], reordered[index + 1]] = [
      reordered[index + 1],
      reordered[index],
    ];
    const updates = reordered.map((block, idx) => ({
      id: block.id,
      order_index: idx,
    }));
    reorderBlocks(params?.id as string, updates).then(() => {
      storeReorderBlocks(updates);
    });
  };

  const handleDeleteBlock = async (id: string | number) => {
    await apiDeleteBlock(id);
    storeDeleteBlock(id);
  };
  const handleUpdateBlock = async (
    id: string | number,
    content: {
      text?: string;
      placeholder?: string;
      mediaId?: string;
      mediaIds?: string[];
      thumbnail?: string;
    },
    config?: any
  ) => {
    await updateBlock(id as string, {
      config: {
        content: {
          ...config,
          ...content,
        },
      },
    });
    storeUpdateBlock(id as string, {
      config: {
        content: {
          ...config,
          ...content,
        },
      },
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (blocks && blocks.length === 0) {
    return <div className="bg-[#D9D9D9] h-full "></div>;
  }
  return (
    <>
      {blocks?.map((block: any, index: number) => (
        <div key={index} className="p-4 mb-4 ">
          {/* Render block content based on type */}
          {(() => {
            switch (block?.type) {
              case 'text':
                return (
                  <TextBlock
                    content={block.config?.content}
                    handleUpdateBlock={(content: {
                      text: string;
                      placeholder: string;
                    }) =>
                      handleUpdateBlock(
                        block.id,
                        content,
                        block.config?.content
                      )
                    }
                  />
                );

              case 'video':
                return (
                  <VideoBlock
                    content={block.config?.content}
                    handleUpdateBlock={(content: { mediaId: string }) =>
                      handleUpdateBlock(
                        block.id,
                        content,
                        block.config?.content
                      )
                    }
                  />
                );
              case 'gallery':
                return (
                  <Gallery
                    content={block.config?.content}
                    handleUpdateBlock={(content: { mediaIds: string[] }) =>
                      handleUpdateBlock(
                        block.id,
                        content,
                        block.config?.content
                      )
                    }
                  />
                );
              case 'split':
                return (
                  <SplitView
                    content={block.config?.content}
                    handleUpdateBlock={(content: {
                      mediaIds?: string[];
                      text?: string;
                      placeholder?: string;
                    }) =>
                      handleUpdateBlock(
                        block.id,
                        content,
                        block.config?.content
                      )
                    }
                  />
                );
              // Add more cases as needed
              default:
                return <div>Unknown block type: {block?.type}</div>;
            }
          })()}
          <div className="flex  items-end justify-between w-full p-4">
            <div></div>
            <div className="flex gap-4">
              <button
                disabled={index === 0}
                className="bg-black p-2 rounded-full disabled:opacity-50"
                onClick={() => moveup(index)}
              >
                <ChevronUp />
              </button>
              <button
                disabled={index === blocks.length - 1}
                className="bg-black p-2 rounded-full disabled:opacity-50"
                onClick={() => movedown(index)}
              >
                <ChevronDown />
              </button>
            </div>
            <button
              className="text-[#D2D1D1] py-1 px-4 border border-[#D2D1D1]  rounded-full"
              onClick={() => handleDeleteBlock(block.id)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default Blocks;
