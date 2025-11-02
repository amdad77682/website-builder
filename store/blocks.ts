import { create } from 'zustand';
interface StoreStates {
  blocks: any[];
  addBlock: (block: any) => void;
  setBlocks: (blocks: any[]) => void;
  deleteBlock: (id: string | number) => void;
  updateBlock: (id: string | number, data: any) => void;
  reorderBlocks: (updates: { id: number; order_index: number }[]) => void;
}
// Zustand store for managing blocks
export const useBlockStore = create<StoreStates>(set => ({
  blocks: [],
  setBlocks: (blocks: any[]) => set({ blocks }),
  addBlock: block => set(state => ({ blocks: [...state.blocks, block] })),
  deleteBlock: id =>
    set(state => ({ blocks: state.blocks.filter(b => b.id !== id) })),
  updateBlock: (id, data) =>
    set(state => ({
      blocks: state.blocks.map(b => (b.id === id ? { ...b, ...data } : b)),
    })),
  reorderBlocks: updates =>
    set(state => ({
      blocks: state.blocks
        .map(b => {
          const update = updates.find(u => u.id === b.id);
          return update ? { ...b, order_index: update.order_index } : b;
        })
        .sort((a, b) => a.order_index - b.order_index),
    })),
}));
