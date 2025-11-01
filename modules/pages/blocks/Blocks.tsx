'use client';
import { getBlocks } from '@/services/blocksService';
import { useBlockStore } from '@/store/blocks';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import useSWR from 'swr';
import TextBlock from './TextBlock';
interface BlocksProps {}

const Blocks: React.FC<BlocksProps> = () => {
  const params = useParams();
  const { blocks, setBlocks } = useBlockStore();
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
  console.log('Blocks:', blockData, blocks);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (blocks && blocks.length === 0) {
    return <div>No blocks available.</div>;
  }
  return (
    <div>
      {blocks?.map((block: any, index: number) => (
        <div key={index} className="p-4 mb-4 border rounded">
          {/* Render block content based on type */}
          {(() => {
            switch (block.type) {
              case 'text':
                return <TextBlock content={block.config?.content} />;
              case 'image':
                return (
                  <img
                    src={block.config?.content?.url}
                    alt="Block Image"
                    className="max-w-full"
                  />
                );
              case 'video':
                return (
                  <video
                    src={block.config?.content?.url}
                    controls
                    className="max-w-full"
                  />
                );
              // Add more cases as needed
              default:
                return <div>Unknown block type: {block.type}</div>;
            }
          })()}
        </div>
      ))}
    </div>
  );
};

export default Blocks;
