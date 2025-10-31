import api from '../lib/api';

export const getPages = async () => {
  const res = await api.get('/pages');
  return res.data;
};

export const getPage = async (id: string | number) => {
  const res = await api.get(`/pages/${id}`);
  return res.data;
};

export const createPage = async (data: {
  title: string;
  slug: string;
  site_id: number;
}) => {
  const res = await api.post('/pages', data);
  return res.data;
};

export const updatePage = async (
  id: string | number,
  data: { title?: string; slug?: string }
) => {
  const res = await api.patch(`/pages/${id}`, data);
  return res.data;
};

export const deletePage = async (id: string | number) => {
  const res = await api.delete(`/pages/${id}`);
  return res.data;
};
