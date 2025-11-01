import Blocks from '@/modules/pages/blocks/Blocks';

interface CustomPageProps {}

const CustomPage: React.FC<CustomPageProps> = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-200">
      <div className="w-full h-full bg-gray-300" style={{ minHeight: '70vh' }}>
        <Blocks />
      </div>
    </div>
  );
};

export default CustomPage;
