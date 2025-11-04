'use client';
import { getPages } from '@/services/pageService';
import { useHeaderStore } from '@/store/header';
import useSWR from 'swr';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const { data: pages } = useSWR('pages', getPages);
  const { headerDisplayName, headerFontColor, headerBackgroundColor } =
    useHeaderStore();

  return (
    <div
      className="flex items-center justify-between px-8 py-4 border-b border-gray-200"
      style={{ background: headerBackgroundColor }}
    >
      <div className="flex items-center gap-4">
        <span
          style={{ color: headerFontColor }}
          className="font-semibold text-lg"
        >
          {headerDisplayName || 'Name'}
        </span>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
          {(Array.isArray(pages) ? pages : []).map((p: any) => (
            <span
              style={{ color: headerFontColor }}
              key={p.id}
              className="whitespace-nowrap font-medium"
            >
              {p.title}
            </span>
          ))}
        </div>
        <button
          style={{ color: headerFontColor }}
          className="border border-current rounded-full px-4 py-1 flex items-center gap-2"
        >
          Contact
        </button>
      </div>
    </div>
  );
};

export default Header;
