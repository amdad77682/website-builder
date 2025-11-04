'use client';
import {
  DEBOUNCE_DELAY,
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_FONT_COLOR,
  DEFAULT_SITE_ID,
  SWR_CACHE_KEYS,
} from '@/modules/contants';
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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useSWR from 'swr';

interface SidebarProps {}

// Stable SWR fetcher function
const fetchHeaders = () => getHeaders(DEFAULT_SITE_ID);

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
  const [headerFontColor, setHeaderFontColor] = useState(DEFAULT_FONT_COLOR);
  const [headerBackgroundColor, setHeaderBackgroundColor] = useState(
    DEFAULT_BACKGROUND_COLOR
  );
  const updateTimerRef = useRef<number | null>(null);

  // SWR: fetch pages and headers
  const { data: swrPages } = useSWR(SWR_CACHE_KEYS.PAGES, getPages);
  const { data: swrHeaders } = useSWR(SWR_CACHE_KEYS.HEADERS, fetchHeaders);

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
        const displayName = h.displayed_name || '';
        const fontColor = h.font_color || DEFAULT_FONT_COLOR;
        const backgroundColor = h.backdrop_color || DEFAULT_BACKGROUND_COLOR;

        storeSetHeaderDisplayName(displayName);
        setHeaderDisplayName(displayName);
        storeSetHeaderFontColor(fontColor);
        setHeaderFontColor(fontColor);
        storeSetHeaderBackgroundColor(backgroundColor);
        setHeaderBackgroundColor(backgroundColor);
      }
    }
  }, [
    swrHeaders,
    setHeaderFromAPI,
    storeSetHeaderDisplayName,
    storeSetHeaderFontColor,
    storeSetHeaderBackgroundColor,
  ]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (updateTimerRef.current !== null) {
        window.clearTimeout(updateTimerRef.current);
      }
    };
  }, []);

  // Add new page
  const handleAddPage = useCallback(async () => {
    if (!newPageName.trim()) {
      message.error('Page name required');
      return;
    }
    setLoading(true);
    try {
      const data = await createPage({
        title: newPageName,
        slug: newPageName.toLowerCase().replace(/\s+/g, '-'),
        site_id: DEFAULT_SITE_ID,
      });
      message.success('Page added');
      setNewPageName('');
      setAddModalOpen(false);
      setPages(prev => [...prev, data]);
    } catch (err: any) {
      message.error(err?.response?.data?.error || 'Failed to add page');
    }
    setLoading(false);
  }, [newPageName]);

  // Rename page
  const handleRenamePage = useCallback(async () => {
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
  }, [renamePageName, renamePageId]);

  // Delete page
  const handleDeletePage = useCallback((id: string | number) => {
    setDeletePageId(id);
    setDeleteModalOpen(true);
  }, []);

  const confirmDeletePage = useCallback(async () => {
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
  }, [deletePageId]);

  // Update header style
  const handleUpdateHeaderStyle = useCallback(async () => {
    try {
      if (headerItems.length === 0) {
        const created = await createHeader({
          site_id: DEFAULT_SITE_ID,
          displayed_name: headerDisplayName,
          font_color: headerFontColor,
          backdrop_color: headerBackgroundColor,
          items: [],
        });
        setHeaderItems([created]);
      } else {
        const updated = await updateHeader(headerItems[0].id, {
          site_id: DEFAULT_SITE_ID,
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
  }, [headerItems, headerDisplayName, headerFontColor, headerBackgroundColor]);

  // Memoized handlers for header input changes
  const handleHeaderDisplayNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setHeaderDisplayName(val);
      storeSetHeaderDisplayName(val);
      if (updateTimerRef.current !== null) {
        window.clearTimeout(updateTimerRef.current);
      }
      updateTimerRef.current = window.setTimeout(() => {
        handleUpdateHeaderStyle();
      }, DEBOUNCE_DELAY);
    },
    [storeSetHeaderDisplayName, handleUpdateHeaderStyle]
  );

  const handleHeaderFontColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setHeaderFontColor(value);
      storeSetHeaderFontColor(value);
      handleUpdateHeaderStyle();
    },
    [storeSetHeaderFontColor, handleUpdateHeaderStyle]
  );

  const handleHeaderBackgroundColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setHeaderBackgroundColor(value);
      storeSetHeaderBackgroundColor(value);
      handleUpdateHeaderStyle();
    },
    [storeSetHeaderBackgroundColor, handleUpdateHeaderStyle]
  );

  // Memoized handlers for modal actions
  const handleOpenAddModal = useCallback(() => {
    setAddModalOpen(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setAddModalOpen(false);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
  }, []);

  const handleCloseRenameModal = useCallback(() => {
    setRenameModalOpen(false);
  }, []);

  const handleRenamePageClick = useCallback(
    (pageId: string | number, pageTitle: string) => {
      setRenamePageId(pageId);
      setRenamePageName(pageTitle);
      setRenameModalOpen(true);
    },
    []
  );

  const handlePageNavigation = useCallback(
    (pageId: string | number) => {
      router.push(`/page/${pageId}`);
    },
    [router]
  );

  // Memoized input handlers for modals
  const handleNewPageNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewPageName(e.target.value);
    },
    []
  );

  const handleRenamePageNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setRenamePageName(e.target.value);
    },
    []
  );

  // Memoized menu items for pages
  const pageMenuItems = useMemo(
    () =>
      pages.map(page => ({
        key: page.id || page.title,
        label: (
          <div className="flex items-center justify-between w-full">
            <span onClick={() => handlePageNavigation(page.id)}>
              {page.title}
            </span>
            <Dropdown
              trigger={['click']}
              menu={{
                items: [
                  {
                    key: 'rename',
                    label: 'Rename',
                    onClick: () => handleRenamePageClick(page.id, page.title),
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
    [pages, handlePageNavigation, handleRenamePageClick, handleDeletePage]
  );

  // Menu items for Website Design
  const websiteDesignItems = useMemo(
    () => [
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
                onClick={handleOpenAddModal}
              />
            </span>
          </div>
        ),
        children: pageMenuItems,
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
                onChange={handleHeaderDisplayNameChange}
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
                    onChange={handleHeaderFontColorChange}
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
                      onChange={handleHeaderBackgroundColorChange}
                      className="color-picker"
                    />
                  </div>
                </div>
              </div>
            ),
          },
        ],
      },
    ],
    [
      pageMenuItems,
      handleOpenAddModal,
      headerDisplayName,
      headerFontColor,
      headerBackgroundColor,
      handleHeaderDisplayNameChange,
      handleHeaderFontColorChange,
      handleHeaderBackgroundColorChange,
    ]
  );

  // Memoized menu items for main navigation
  const menuItems = useMemo(
    () => [
      {
        key: 'website-design',
        label: <span className="font-semibold">Website Design</span>,
        children: websiteDesignItems,
      },
    ],
    [websiteDesignItems]
  );

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
              items={menuItems}
              style={{ background: 'transparent', color: 'white' }}
            />
          </div>
        </nav>
        {/* Add Page Modal */}
        <Modal
          title="Create a New Page"
          open={addModalOpen}
          onOk={handleAddPage}
          onCancel={handleCloseAddModal}
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
            onChange={handleNewPageNameChange}
            onPressEnter={handleAddPage}
          />
        </Modal>
        {/* Delete Page Modal */}
        <Modal
          title="Delete Page"
          open={deleteModalOpen}
          onOk={confirmDeletePage}
          onCancel={handleCloseDeleteModal}
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
          onCancel={handleCloseRenameModal}
          okText="Rename"
          confirmLoading={loading}
          okButtonProps={{
            style: { background: '#181818', color: '#fff', border: 'none' },
          }}
        >
          <Input
            placeholder="New page name"
            value={renamePageName}
            onChange={handleRenamePageNameChange}
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
