import { Input } from 'antd';
import MinimalArticleEditor from './common/ArticleEditor';

interface TextBlockProps {
  content: any;
}

const TextBlock: React.FC<TextBlockProps> = ({ content }) => {
  return (
    <div>
      <MinimalArticleEditor placeholder={content?.text} />
    </div>
  );
};

export default TextBlock;
