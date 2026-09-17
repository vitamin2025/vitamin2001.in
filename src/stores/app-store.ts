import { create } from "zustand";

interface AppState {
  sidebarOpen: boolean;
  activeClient: string | null;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveClient: (client: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  activeClient: null,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  setActiveClient: (client: string | null) => set({ activeClient: client }),
}));
