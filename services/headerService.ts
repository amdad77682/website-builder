import api from '../lib/api';

export const getHeaders = async () => {
  const res = await api.get('/header-menus?site_id=1');
  return res.data;
};

export const getHeader = async (id: string | number) => {
  const res = await api.get(`/header-menus/${id}`);
  return res.data;
};

export const createHeader = async (data: {
  site_id: number;
  displayed_name?: string;
  font_color?: string;
  backdrop_color?: string;
  items: any[];
}) => {
  const res = await api.post('/header-menus', data);
  return res.data;
};

export const updateHeader = async (
  id: string | number,
  data: {
    site_id: number;
    displayed_name?: string;
    font_color?: string;
    backdrop_color?: string;
    items: any[];
  }
) => {
  const res = await api.patch(`/header-menus/${id}`, data);
  return res.data;
};

export const deleteHeader = async (id: string | number) => {
  const res = await api.delete(`/header-menus/${id}`);
  return res.data;
};
