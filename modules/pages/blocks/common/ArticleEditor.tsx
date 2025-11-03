import { Bold, Italic, Link, Underline } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface MinimalArticleEditorProps {
  placeholder?: string;
  text?: string;
  onContentChange: (content: { text: string; placeholder: string }) => void;
}

interface PopoverPosition {
  top: number;
  left: number;
}

const MinimalArticleEditor: React.FC<MinimalArticleEditorProps> = ({
  placeholder,
  text,
  onContentChange,
}) => {
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const [popoverPosition, setPopoverPosition] = useState<PopoverPosition>({
    top: 0,
    left: 0,
  });
  const editorRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<number | null>(null);

  useEffect(() => {
    // Focus the editor on mount
    if (editorRef.current && editorRef.current.textContent === '') {
      editorRef.current.focus();
    }
  }, []);

  const handleSelect = (): void => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setShowPopover(false);
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    setPopoverPosition({
      top: rect.top + scrollTop - 60,
      left: rect.left + rect.width / 2,
    });

    setShowPopover(true);
  };
  const handleContentChange = (content: string) => {
    if (debounceTimerRef.current !== null) {
      window.clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = window.setTimeout(() => {
      onContentChange({
        text: content,
        placeholder: placeholder || '',
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current !== null) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const applyFormat = (command: string, value?: string): void => {
    document.execCommand(command, false, value);

    // Keep focus on editor
    if (editorRef.current) {
      editorRef.current.focus();
    }

    setShowPopover(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    // Cmd/Ctrl + B for bold
    if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
      e.preventDefault();
      applyFormat('bold');
    }
    // Cmd/Ctrl + I for italic
    if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
      e.preventDefault();
      applyFormat('italic');
    }
    // Cmd/Ctrl + U for underline
    if ((e.metaKey || e.ctrlKey) && e.key === 'u') {
      e.preventDefault();
      applyFormat('underline');
    }
  };

  const handleLinkClick = (): void => {
    const url = prompt('Enter URL:');
    if (url) {
      applyFormat('createLink', url);
    } else {
      setShowPopover(false);
    }
  };

  return (
    <div className="relative">
      <div
        ref={editorRef}
        contentEditable
        onMouseUp={handleSelect}
        onKeyUp={handleSelect}
        onInput={e =>
          handleContentChange((e.target as HTMLDivElement).innerText || '')
        }
        dangerouslySetInnerHTML={{ __html: text || '' }}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => setShowPopover(false), 200)}
        data-placeholder={placeholder || 'Start writing...'}
        className="w-full text-gray-800 text-lg leading-relaxed outline-none border-none focus:outline-none  empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
        style={{
          lineHeight: '1.8',
          fontFamily: 'Georgia, serif',
        }}
      />

      {/* Formatting Popover */}
      {showPopover && (
        <div
          className="fixed bg-gray-900 text-white rounded-lg shadow-2xl px-2 py-2 flex gap-1 z-50 transform -translate-x-1/2"
          style={{
            top: `${popoverPosition.top}px`,
            left: `${popoverPosition.left}px`,
          }}
        >
          <button
            onMouseDown={e => {
              e.preventDefault();
              applyFormat('bold');
            }}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onMouseDown={e => {
              e.preventDefault();
              applyFormat('italic');
            }}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onMouseDown={e => {
              e.preventDefault();
              applyFormat('underline');
            }}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            title="Underline (Ctrl+U)"
          >
            <Underline className="w-4 h-4" />
          </button>
          <button
            onMouseDown={e => {
              e.preventDefault();
              handleLinkClick();
            }}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            title="Insert Link"
          >
            <Link className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MinimalArticleEditor;
