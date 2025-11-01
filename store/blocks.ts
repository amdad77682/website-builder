import { create } from 'zustand';
interface StoreStates {
  blocks: any[];
  addBlock: (block: any) => void;
  setBlocks: (blocks: any[]) => void;
}
// Zustand store for managing blocks
export const useBlockStore = create<StoreStates>(set => ({
  blocks: [],
  setBlocks: (blocks: any[]) => set({ blocks }),
  addBlock: block => set(state => ({ blocks: [...state.blocks, block] })),
}));
