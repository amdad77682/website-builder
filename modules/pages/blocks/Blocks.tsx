'use client';
import { getBlocks } from '@/services/blocksService';
import { useBlockStore } from '@/store/blocks';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import useSWR from 'swr';
import TextBlock from './TextBlock';
import VideoBlock from './VideoBlock';
import SplitView from './SplitView';
import Gallery from './Gallary';
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
    <>
      {blocks?.map((block: any, index: number) => (
        <div key={index} className="p-4 mb-4 ">
          {/* Render block content based on type */}
          {(() => {
            switch (block.type) {
              case 'text':
                return <TextBlock content={block.config?.content} />;

              case 'video':
                return <VideoBlock content={block.config?.content} />;
              case 'gallery':
                return <Gallery content={block.config?.content} />;
              case 'split':
                return <SplitView content={block.config?.content} />;
              // Add more cases as needed
              default:
                return <div>Unknown block type: {block.type}</div>;
            }
          })()}
        </div>
      ))}
    </>
  );
};

export default Blocks;
