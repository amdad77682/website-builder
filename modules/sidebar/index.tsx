'use client';
import {
  createHeader,
  getHeaders,
  updateHeader,
} from '@/services/headerService';
import {
  createPage,
  deletePage,
  getPages,
  updatePage,
} from '@/services/pageService';
import { useHeaderStore } from '@/store/header';
import { Dropdown, Input, Menu, message, Modal } from 'antd';
import {
  CaseSensitive,
  ChevronLeft,
  LayoutList,
  MoreVertical,
  Pencil,
  Plus,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';

interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = () => {
  const params = useParams();
  const router = useRouter();
  const pageId = params?.id as string | undefined;
  const [pages, setPages] = useState<any[]>([]);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renamePageId, setRenamePageId] = useState<string | number | null>(
    null
  );
  const [renamePageName, setRenamePageName] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePageId, setDeletePageId] = useState<string | number | null>(
    null
  );
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [headerDisplayName, setHeaderDisplayName] = useState('');
  const [headerItems, setHeaderItems] = useState<any[]>([]);
  const [headerFontColor, setHeaderFontColor] = useState('#000000');
  const [headerBackgroundColor, setHeaderBackgroundColor] = useState('#FFFFFF');
  const updateTimerRef = useRef<number | null>(null);

  // SWR: fetch pages and headers
  const { data: swrPages } = useSWR('pages', getPages);
  const { data: swrHeaders } = useSWR('headers', () => getHeaders(1));

  const {
    setHeaderFromAPI,
    setHeaderDisplayName: storeSetHeaderDisplayName,
    setHeaderFontColor: storeSetHeaderFontColor,
    setHeaderBackgroundColor: storeSetHeaderBackgroundColor,
  } = useHeaderStore();

  useEffect(() => {
    if (Array.isArray(swrPages)) {
      setPages(swrPages);
    }
  }, [swrPages]);

  useEffect(() => {
    if (Array.isArray(swrHeaders)) {
      setHeaderItems(swrHeaders);
      if (swrHeaders.length > 0) {
        const h = swrHeaders[0];
        console.log(h);

        setHeaderFromAPI(h);
        storeSetHeaderDisplayName(h.displayed_name || '');
        setHeaderDisplayName(h.displayed_name || '');
        storeSetHeaderFontColor(h.font_color || '#000000');
        setHeaderFontColor(h.font_color || '#000000');
        storeSetHeaderBackgroundColor(h.backdrop_color || '#FFFFFF');
        setHeaderBackgroundColor(h.backdrop_color || '#FFFFFF');
      }
    }
  }, [
    swrHeaders,
    setHeaderFromAPI,
    storeSetHeaderDisplayName,
    storeSetHeaderFontColor,
    storeSetHeaderBackgroundColor,
  ]);

  // Add new page
  const handleAddPage = async () => {
    if (!newPageName.trim()) {
      message.error('Page name required');
      return;
    }
    setLoading(true);
    try {
      const data = await createPage({
        title: newPageName,
        slug: newPageName.toLowerCase().replace(/\s+/g, '-'),
        site_id: 1,
      });
      message.success('Page added');
      setNewPageName('');
      setAddModalOpen(false);
      setPages(prev => [...prev, data]);
    } catch (err: any) {
      message.error(err?.response?.data?.error || 'Failed to add page');
    }
    setLoading(false);
  };

  // Rename page
  const handleRenamePage = async () => {
    if (!renamePageName.trim() || !renamePageId) {
      message.error('Page name required');
      return;
    }
    setLoading(true);
    try {
      const updated = await updatePage(renamePageId, {
        title: renamePageName,
      });
      message.success('Page renamed');
      setRenameModalOpen(false);
      setRenamePageId(null);
      setRenamePageName('');
      setPages(pages => pages.map(p => (p.id === updated.id ? updated : p)));
    } catch (err: any) {
      message.error(err?.response?.data?.error || 'Failed to rename page');
    }
    setLoading(false);
  };

  // Delete page
  const handleDeletePage = (id: string | number) => {
    setDeletePageId(id);
    setDeleteModalOpen(true);
  };

  const confirmDeletePage = async () => {
    if (!deletePageId) return;
    setLoading(true);
    try {
      await deletePage(deletePageId);
      message.success('Page deleted');
      setPages(pages => pages.filter(p => p.id !== deletePageId));
      setDeleteModalOpen(false);
      setDeletePageId(null);
    } catch (err: any) {
      message.error(err?.response?.data?.error || 'Failed to delete page');
    }
    setLoading(false);
  };

  // Update header style
  const handleUpdateHeaderStyle = async () => {
    try {
      if (headerItems.length === 0) {
        const created = await createHeader({
          site_id: 1,
          displayed_name: headerDisplayName,
          font_color: headerFontColor,
          backdrop_color: headerBackgroundColor,
          items: [],
        });
        setHeaderItems([created]);
      } else {
        const updated = await updateHeader(headerItems[0].id, {
          site_id: 1,
          displayed_name: headerDisplayName,
          font_color: headerFontColor,
          backdrop_color: headerBackgroundColor,
          items: [],
        });
        setHeaderItems([updated]);
      }
      // sync to header store
    } catch (err: any) {
      message.error(err.message || 'Failed to update header style');
    }
  };

  // Menu items for Website Design
  const websiteDesignItems = [
    {
      key: 'pages',
      icon: <LayoutList size={18} />,
      label: (
        <div className="flex items-center justify-between w-full">
          <span>Pages</span>
          <span className="flex items-center gap-2">
            <Plus
              size={16}
              className="cursor-pointer"
              onClick={() => setAddModalOpen(true)}
            />
          </span>
        </div>
      ),
      children: pages.map(page => ({
        key: page.id || page.title,
        label: (
          <div className="flex items-center justify-between w-full">
            <span onClick={() => router.push(`/page/${page.id}`)}>
              {page.title}
            </span>
            <Dropdown
              trigger={['click']}
              menu={{
                items: [
                  {
                    key: 'rename',
                    label: 'Rename',
                    onClick: () => {
                      setRenamePageId(page.id);
                      setRenamePageName(page.title);
                      setRenameModalOpen(true);
                    },
                  },
                  {
                    key: 'delete',
                    label: <span className="text-red-500">Delete</span>,
                    onClick: () => handleDeletePage(page.id),
                  },
                ],
              }}
            >
              <MoreVertical size={16} className="cursor-pointer ml-2" />
            </Dropdown>
          </div>
        ),
      })),
    },
    {
      key: 'header-menu',
      icon: <LayoutList size={18} />,
      label: 'Header/Menu',
      children: [
        {
          key: 'header-display-name',
          label: (
            <div className="space-y-1">
              <label className="flex items-center text-sm gap-2 text-gray-300">
                <Pencil size={12} />
                Displayed name
              </label>
            </div>
          ),
        },
        {
          key: 'header-background-color',
          label: (
            <Input
              placeholder="Name"
              value={headerDisplayName}
              onChange={e => {
                const val = e.target.value;
                setHeaderDisplayName(val);
                storeSetHeaderDisplayName(val);
                if (updateTimerRef.current !== null) {
                  window.clearTimeout(updateTimerRef.current);
                }
                updateTimerRef.current = window.setTimeout(() => {
                  handleUpdateHeaderStyle();
                }, 600);
              }}
              className="bg-[#FFFFFF33]! border-none! text-white! placeholder:text-white!"
            />
          ),
        },
        {
          key: 'header-font-color',
          label: (
            <div className="flex flex-col gap-1">
              <div className="flex items-center text-sm gap-2 text-gray-300">
                <CaseSensitive size={12} />
                <span className="text-xs">Font Color</span>

                <Input
                  type="color"
                  value={headerFontColor}
                  onChange={e => {
                    const value = e.target.value;
                    setHeaderFontColor(value);
                    storeSetHeaderFontColor(value);
                    handleUpdateHeaderStyle();
                  }}
                  className="color-picker"
                />
              </div>
            </div>
          ),
        },
        {
          key: 'header-backdrop-color',
          label: (
            <div className="space-y-1">
              <div className="flex flex-col gap-1">
                <div className="flex items-center text-sm gap-2 text-gray-300">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.371094 2.59407L2.59456 0.370605M5.92976 0.370605L0.371094 5.92927M0.371094 9.26447L9.26496 0.370605M9.26496 3.7058L3.70629 9.26447M9.26496 7.041L7.04149 9.26447"
                      stroke="#DFDFDF"
                      strokeWidth="0.741155"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-xs">Backdrop Color</span>

                  <Input
                    type="color"
                    value={headerBackgroundColor}
                    onChange={e => {
                      const value = e.target.value;
                      setHeaderBackgroundColor(value);

                      storeSetHeaderBackgroundColor(value);
                      handleUpdateHeaderStyle();
                    }}
                    className="color-picker"
                  />
                </div>
              </div>
            </div>
          ),
        },
      ],
    },
  ];

  return (
    <aside className="bg-[#181818] text-white w-64 flex flex-col justify-between py-6 px-4">
      <div>
        {/* Profile */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
            {/* Profile Icon */}
            <span className="text-xl">
              <ChevronLeft />
            </span>
          </div>
          <span className="font-semibold">Profile</span>
        </div>
        {/* Navigation with Ant Design Menu */}
        <nav className="space-y-2">
          <div className="bg-transparent">
            <Menu
              mode="inline"
              theme="dark"
              defaultOpenKeys={['website-design', 'pages', 'header-menu']}
              selectedKeys={pageId ? [pageId] : []}
              items={[
                {
                  key: 'website-design',
                  label: <span className="font-semibold">Website Design</span>,
                  children: websiteDesignItems,
                },
              ]}
              style={{ background: 'transparent', color: 'white' }}
            />
          </div>
        </nav>
        {/* Add Page Modal */}
        <Modal
          title="Create a New Page"
          open={addModalOpen}
          onOk={handleAddPage}
          onCancel={() => setAddModalOpen(false)}
          okText="Add"
          confirmLoading={loading}
          okButtonProps={{
            style: { background: '#181818', color: '#fff', border: 'none' },
          }}
        >
          <span>Give your new page a title to show what it is about.</span>
          <Input
            placeholder="Set a name"
            value={newPageName}
            onChange={e => setNewPageName(e.target.value)}
            onPressEnter={handleAddPage}
          />
        </Modal>
        {/* Delete Page Modal */}
        <Modal
          title="Delete Page"
          open={deleteModalOpen}
          onOk={confirmDeletePage}
          onCancel={() => setDeleteModalOpen(false)}
          okText="Delete"
          okButtonProps={{
            style: { background: '#181818', color: '#fff', border: 'none' },
          }}
          confirmLoading={loading}
        >
          <span>Are you sure you want to delete this page?</span>
        </Modal>
        {/* Rename Page Modal */}
        <Modal
          title="Rename Page"
          open={renameModalOpen}
          onOk={handleRenamePage}
          onCancel={() => setRenameModalOpen(false)}
          okText="Rename"
          confirmLoading={loading}
          okButtonProps={{
            style: { background: '#181818', color: '#fff', border: 'none' },
          }}
        >
          <Input
            placeholder="New page name"
            value={renamePageName}
            onChange={e => setRenamePageName(e.target.value)}
            onPressEnter={handleRenamePage}
          />
        </Modal>
      </div>
      {/* Publish Button */}
      <button className="bg-gray-800 text-white rounded-full py-2 px-6 flex items-center gap-2 w-full mt-8">
        <span>🔥</span> Publish
      </button>
    </aside>
  );
};

export default Sidebar;
