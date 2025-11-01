import { Input } from 'antd';

interface TextBlockProps {
  content: any;
}

const TextBlock: React.FC<TextBlockProps> = ({ content }) => {
  return (
    <div>
      <Input.TextArea
        rows={4}
        placeholder={content?.text}
        className="bg-transparent! border-none focus:ring-0 focus:outline-none!"
      />
    </div>
  );
};

export default TextBlock;
