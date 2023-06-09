import { create } from 'zustand';
import { lightTheme, darkTheme } from '../styles/theme';
import { dataTypes } from '../types';
import axiosInstance from '../api/axiosInstance';

interface Store {
  theme: typeof lightTheme | typeof darkTheme;
  themeName: string;
  toggleTheme: () => void;
  setTheme: (theme: string) => void;
}

interface DataStore {
  data: dataTypes[];
  selectedData: dataTypes | null;
  isSidebarOpen: boolean;
  contentValue: string;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  onContentChange: (content: string) => void;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  setSelectedData: (item: dataTypes) => void;
  fetchAllData: () => void;
  removeMarkdown: (id: string) => void;
  createNewMarkdown: () => void;
  updateMarkdown: (id: string, title: string, content: string) => void;
}

export const useThemeStore = create<Store>(set => ({
  theme: darkTheme,
  themeName: 'dark',
  toggleTheme: () =>
    set(state => ({
      theme: state.theme === lightTheme ? darkTheme : lightTheme,
    })),

  setTheme: (theme: string) =>
    set(() => ({
      themeName: theme === 'light' ? 'light' : 'dark',
      theme: theme === 'light' ? lightTheme : darkTheme,
    })),
}));

export const useDataStore = create<DataStore>(set => ({
  data: [],
  isSidebarOpen: false,
  toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),
  selectedData: null,
  contentValue: '',
  isLoading: false,
  setIsLoading: (value: boolean) => set({ isLoading: value }),

  onContentChange: (content: string) => set({ contentValue: content }),
  setSelectedData: (item: dataTypes) =>
    set({ selectedData: item, isSidebarOpen: false }),

  fetchAllData: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get('/markdown');
      const data = res.data;
      set({
        data: data,
        selectedData: data[0],
        isLoading: false,
      });
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
    }
  },

  removeMarkdown: async (id: string) => {
    try {
      const res = await axiosInstance.delete(`/markdown/${id}`);
      const data = res.data;
      set({ data: data, selectedData: data[0] });
    } catch (error) {
      console.log(error);
    }
  },

  createNewMarkdown: async () => {
    try {
      const res = await axiosInstance.post('/markdown', {
        title: 'Untitled.md',
        content: '',
      });
      const data = res.data;
      //set selectedData to the newly created markdown

      set({ data: data });
    } catch (error) {
      console.log(error);
    }
  },

  updateMarkdown: async (id: string, title: string, content: string) => {
    try {
      await axiosInstance.put(`/markdown/${id}`, {
        title,
        content,
      });

      set(state => {
        const updatedData = state.data.map((item: dataTypes) => {
          if (item.id === id) {
            return { ...item, title, content };
          }
          return item;
        });

        return {
          data: updatedData,
          selectedData: updatedData.find((item: dataTypes) => item.id === id),
        };
      });
    } catch (error) {
      console.log(error);
    }
  },
}));
