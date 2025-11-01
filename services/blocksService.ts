import api from '@/lib/api';

export const createBlocks = async (data: any) => {
  const res = await api.post('/page-blocks', data);
  return res.data;
};

export const getBlocks = async (id: string | number) => {
  const res = await api.get(`/page-blocks?page_id=${id}`);
  return res.data;
};
