import { create } from "zustand";

export const useSensorStore = create((set, get) => ({
  data: {},
  addSensor: (id, data = []) => {
    set({
      data: {
        [`${id}`]: data,
      },
    });
  },
  updateSensor: (id, data) => {
    set((state) => ({
      data: {
        [`${id}`]:
          state.data[id] && state.data[id].length > 0
            ? [data, ...state.data[id]]
            : [data],
      },
    }));
  },
  clear: () => {
    set({ data: {} });
  },
}));
