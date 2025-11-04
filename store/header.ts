import { create } from 'zustand';

interface HeaderStyleState {
  headerDisplayName: string;
  headerFontColor: string;
  headerBackgroundColor: string;
  setHeaderDisplayName: (name: string) => void;
  setHeaderFontColor: (color: string) => void;
  setHeaderBackgroundColor: (color: string) => void;
  setHeaderFromAPI: (data: {
    displayed_name?: string;
    font_color?: string;
    backdrop_color?: string;
  }) => void;
}

export const useHeaderStore = create<HeaderStyleState>(set => ({
  headerDisplayName: '',
  headerFontColor: '',
  headerBackgroundColor:  '',
  setHeaderDisplayName: name => set({ headerDisplayName: name }),
  setHeaderFontColor: color => set({ headerFontColor: color }),
  setHeaderBackgroundColor: color => set({ headerBackgroundColor: color }),
  setHeaderFromAPI: data =>
    set({
      headerDisplayName: data.displayed_name || '',
      headerFontColor: data.font_color ||'' ,
      headerBackgroundColor: data.backdrop_color || '',
    }),
}));


