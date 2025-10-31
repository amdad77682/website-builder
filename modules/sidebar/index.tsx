'use client';
import { Dropdown, Input, Menu, message, Modal } from 'antd';
import { ChevronLeft, LayoutList, MoreVertical, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  getPages,
  getPage,
  createPage,
  updatePage,
  deletePage,
} from '@/services/pageService';
interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = () => {
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

  // Fetch pages from API
  useEffect(() => {
    async function fetchPages() {
      setLoading(true);
      try {
        const data = await getPages();
        setPages(Array.isArray(data) ? data : []);
      } catch (err) {
        message.error('Failed to load pages');
      }
      setLoading(false);
    }
    fetchPages();
  }, []);

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
      const updated = await updatePage(renamePageId, { title: renamePageName });
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
            <span>{page.title}</span>
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
              defaultOpenKeys={['pages', 'header-menu']}
              items={[
                {
                  key: 'website-design',
                  label: <span className="font-semibold">Website Design</span>,
                  children: websiteDesignItems,
                },
              ]}
              style={{ background: 'transparent', color: 'white' }}
              selectable={false}
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
