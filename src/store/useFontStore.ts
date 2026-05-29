import * as Font from "expo-font";
import create from "zustand";

type FontState = {
  loaded: Record<string, boolean>;
  loadFont: (key: string, asset: any) => Promise<void>;
};

export const useFontStore = create<FontState>((set, get) => ({
  loaded: {},
  loadFont: async (key: string, asset: any) => {
    try {
      // asset can be a local require(...) or an object mapping
      await Font.loadAsync({ [key]: asset });
      set((s) => ({ loaded: { ...s.loaded, [key]: true } }));
    } catch (e) {
      console.warn("Failed to load font", key, e);
      throw e;
    }
  },
}));

export default useFontStore;
