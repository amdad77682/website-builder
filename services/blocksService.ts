import api from '@/lib/api';

export const createBlocks = async (data: any) => {
  const res = await api.post('/page-blocks', data);
  return res.data;
};

export const getBlocks = async (id: string | number) => {
  const res = await api.get(`/page-blocks?page_id=${id}`);
  return res.data;
};

export const deleteBlock = async (id: string | number) => {
  const res = await api.delete(`/page-blocks/${id}`);
  return res.data;
};

export const updateBlock = async (id: string | number, data: any) => {
  const res = await api.patch(`/page-blocks/${id}`, data);
  return res.data;
};

export const reorderBlocks = async (
  page_id: string | number,
  updates: { id: number; order_index: number }[]
) => {
  const res = await api.patch('/page-blocks/reorder', {
    page_id,
    updates,
  });
  return res.data;
};
