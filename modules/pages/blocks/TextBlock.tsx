import MinimalArticleEditor from './common/ArticleEditor';

interface TextBlockProps {
  content: any;
  handleUpdateBlock: (content: { text: string; placeholder: string }) => void;
}

const TextBlock: React.FC<TextBlockProps> = ({
  content,
  handleUpdateBlock,
}) => {
  return (
    <div>
      <MinimalArticleEditor
        placeholder={content?.placeholder}
        text={content?.text || ''}
        onContentChange={(content: { text: string; placeholder: string }) =>
          handleUpdateBlock(content)
        }
      />
    </div>
  );
};

export default TextBlock;
