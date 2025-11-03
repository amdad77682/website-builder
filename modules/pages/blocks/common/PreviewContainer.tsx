'use client';
import { getBlocks } from '@/services/blocksService';
import { getHeaders } from '@/services/headerService';
import { getPage } from '@/services/pageService';
import { Monitor, Smartphone } from 'lucide-react';
import { FC, useState } from 'react';
import useSWR from 'swr';

interface IProps {
  id: string;
}

type ViewMode = 'desktop' | 'mobile';

// Preview header component
const PreviewHeader: FC<{ headerData: any; viewMode: ViewMode }> = ({
  headerData,
  viewMode,
}) => {
  if (!headerData || !Array.isArray(headerData) || headerData.length === 0) {
    return null;
  }

  // Get the first header menu
  const header = headerData[0];
  const { displayed_name, font_color, backdrop_color, items } = header;

  const isMobile = viewMode === 'mobile';

  return (
    <header
      style={{
        backgroundColor: backdrop_color || '#000000',
        color: font_color || '#ffffff',
      }}
      className={`${isMobile ? 'flex-col px-4' : 'flex-row px-8'} flex items-center justify-between py-4 border-b border-gray-200`}
    >
      <div className="flex items-center gap-4">
        <span className="font-semibold text-lg">
          {displayed_name || 'Logo'}
        </span>
      </div>
      <nav
        className={`${isMobile ? 'flex-col gap-2 w-full mt-2' : 'flex-row gap-4'} flex items-center`}
      >
        {Array.isArray(items) &&
          items.map((item: any, index: number) => (
            <a
              key={index}
              href={item.url || '#'}
              className="font-semibold hover:opacity-70 transition-opacity"
            >
              {item.label || item.name || `Menu ${index + 1}`}
            </a>
          ))}
        <button className="border border-gray-300 rounded-full px-4 py-1 flex items-center gap-2 hover:bg-gray-50 transition-colors">
          Contact
        </button>
      </nav>
    </header>
  );
};

// Preview block components (simplified display versions)
const PreviewTextBlock: FC<{ content: any }> = ({ content }) => {
  const text = content?.text || '';
  return (
    <div className="w-full py-8 px-4">
      <div
        className="text-gray-800 text-lg leading-relaxed"
        style={{
          lineHeight: '1.8',
          fontFamily: 'Georgia, serif',
        }}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </div>
  );
};

const PreviewVideoBlock: FC<{ content: any }> = ({ content }) => {
  const videoUrl = content?.mediaId || content?.url || content?.src;
  const thumbnail = content?.thumbnail;

  return (
    <div className="w-full bg-black flex items-center justify-center min-h-[400px]">
      {videoUrl ? (
        <video
          src={videoUrl}
          controls
          className="max-w-full max-h-[600px]"
          poster={thumbnail}
        />
      ) : thumbnail ? (
        <img
          src={thumbnail}
          alt="Video thumbnail"
          className="max-w-full max-h-[600px]"
        />
      ) : (
        <div className="text-white text-center">
          <p>No video available</p>
        </div>
      )}
    </div>
  );
};

const PreviewGalleryBlock: FC<{ content: any; viewMode: ViewMode }> = ({
  content,
  viewMode,
}) => {
  const images = content?.mediaIds || content?.items || [];

  if (!Array.isArray(images) || images.length === 0) {
    return (
      <div className="w-full p-4">
        <div className="bg-gray-200 min-h-[400px] flex items-center justify-center">
          <p className="text-gray-500">No images available</p>
        </div>
      </div>
    );
  }

  const isMobile = viewMode === 'mobile';
  const gridCols = isMobile ? 'grid-cols-1' : 'grid-cols-3';

  return (
    <div className="w-full p-4">
      <div className={`grid ${gridCols} gap-4`}>
        {images.map((image: string, index: number) => (
          <img
            key={index}
            src={image}
            alt={`Gallery ${index + 1}`}
            className="w-full h-72 object-cover rounded"
          />
        ))}
      </div>
    </div>
  );
};

const PreviewSplitViewBlock: FC<{ content: any; viewMode: ViewMode }> = ({
  content,
  viewMode,
}) => {
  const leftContent = content?.left || {};
  const rightContent = content?.right || {};
  const isMobile = viewMode === 'mobile';

  return (
    <div className={`w-full ${isMobile ? 'flex-col' : 'flex'}`}>
      <div className={`${isMobile ? 'w-full' : 'w-1/2'} p-4`}>
        {leftContent.type === 'text' && (
          <div
            className="text-gray-800"
            dangerouslySetInnerHTML={{ __html: content.text || '' }}
          />
        )}
        {leftContent.type === 'gallery' && content.mediaIds && (
          <img
            src={content.mediaIds[0]}
            alt="Split view left"
            className="w-full h-auto object-contain"
          />
        )}
      </div>
      <div className={`${isMobile ? 'w-full' : 'w-1/2'} p-4`}>
        {rightContent.type === 'text' && (
          <div
            className="text-gray-800"
            dangerouslySetInnerHTML={{ __html: content.text || '' }}
          />
        )}
        {rightContent.type === 'gallery' && content.mediaIds && (
          <img
            src={content.mediaIds[0]}
            alt="Split view right"
            className="w-full h-auto object-contain"
          />
        )}
      </div>
    </div>
  );
};

export const Preview: FC<IProps> = ({ id }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');

  // Fetch page data to get site_id
  const { data: pageData, isLoading: pageLoading } = useSWR(
    id ? `page_${id}` : null,
    async () => {
      const response = await getPage(id);
      return response;
    }
  );

  // Fetch header menu using site_id from page data
  const { data: headerData, isLoading: headerLoading } = useSWR(
    pageData?.site_id ? `headers_${pageData.site_id}` : null,
    async () => {
      const response = await getHeaders(pageData.site_id);
      return response;
    }
  );

  // Fetch page blocks
  const { data: blocksData, isLoading: blocksLoading } = useSWR(
    id ? `blocks_${id}` : null,
    async () => {
      const response = await getBlocks(id);
      return response;
    }
  );

  const isLoading = pageLoading || headerLoading || blocksLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading preview...</div>
      </div>
    );
  }

  // Determine container width based on view mode
  const containerClass =
    viewMode === 'desktop'
      ? 'w-full max-w-6xl mx-auto'
      : 'w-full max-w-md mx-auto';

  return (
    <div className="w-full">
      {/* Tab Switcher */}
      <div className="flex items-center justify-center gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setViewMode('desktop')}
          className={`flex items-center gap-2 px-4 py-2 transition-colors ${
            viewMode === 'desktop'
              ? 'border-b-2 border-blue-500 text-blue-500 font-semibold'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Monitor className="w-5 h-5" />
          Desktop
        </button>
        <button
          onClick={() => setViewMode('mobile')}
          className={`flex items-center gap-2 px-4 py-2 transition-colors ${
            viewMode === 'mobile'
              ? 'border-b-2 border-blue-500 text-blue-500 font-semibold'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Smartphone className="w-5 h-5" />
          Mobile
        </button>
      </div>

      {/* Preview Container */}
      <div className="flex justify-center">
        <div
          className={`${containerClass} bg-white shadow-lg ${
            viewMode === 'mobile'
              ? 'border border-gray-300 rounded-lg overflow-hidden'
              : ''
          }`}
          style={{
            minHeight: viewMode === 'mobile' ? '667px' : 'auto',
          }}
        >
          {/* Header */}
          <PreviewHeader headerData={headerData} viewMode={viewMode} />

          {/* Blocks */}
          <main>
            {!blocksData || blocksData.length === 0 ? (
              <div className="bg-gray-100 min-h-[400px] flex items-center justify-center">
                <p className="text-gray-500">No blocks available</p>
              </div>
            ) : (
              blocksData.map((block: any, index: number) => {
                switch (block?.type) {
                  case 'text':
                    return (
                      <PreviewTextBlock
                        key={block.id || index}
                        content={block.config?.content}
                      />
                    );
                  case 'video':
                    return (
                      <PreviewVideoBlock
                        key={block.id || index}
                        content={block.config?.content}
                      />
                    );
                  case 'gallery':
                    return (
                      <PreviewGalleryBlock
                        key={block.id || index}
                        content={block.config?.content}
                        viewMode={viewMode}
                      />
                    );
                  case 'split':
                    return (
                      <PreviewSplitViewBlock
                        key={block.id || index}
                        content={block.config?.content}
                        viewMode={viewMode}
                      />
                    );
                  default:
                    return (
                      <div key={block.id || index} className="p-4">
                        <p className="text-gray-500">
                          Unknown block type: {block?.type}
                        </p>
                      </div>
                    );
                }
              })
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
