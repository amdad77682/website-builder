import Blocks from '@/modules/pages/blocks/Blocks';

interface CustomPageProps {}

const CustomPage: React.FC<CustomPageProps> = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-white">
      <div className="w-full   overflow-y-scroll " style={{ height: '83vh' }}>
        <Blocks />
      </div>
    </div>
  );
};

export default CustomPage;
