import { Input } from 'antd';

interface TextBlockProps {
  content: any;
}

const TextBlock: React.FC<TextBlockProps> = ({ content }) => {
  return (
    <div>
      <Input.TextArea rows={4} placeholder={content?.text} />
    </div>
  );
};

export default TextBlock;
