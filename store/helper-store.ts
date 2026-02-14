import { create } from 'zustand';

interface ChatHelperState {
  show: boolean;
  toggleShow: () => void;
}

export const useChatHelperStore = create<ChatHelperState>((set) => ({
  show: false,
  toggleShow: () => set((state) => ({ show: !state.show }))
}));
