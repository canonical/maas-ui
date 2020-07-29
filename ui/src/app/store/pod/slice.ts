import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { Pod, PodState } from "./types";

export const DEFAULT_STATUSES = {
  composing: false,
  deleting: false,
  refreshing: false,
};

const podSlice = createSlice({
  initialState: {
    errors: {},
    items: [],
    loaded: false,
    loading: false,
    saved: false,
    saving: false,
    selected: [],
    statuses: {},
  },
  name: "pod",
  reducers: {
    fetch: {
      prepare: (params?) => ({
        meta: {
          model: "pod",
          method: "list",
        },
        payload: params && {
          params,
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    fetchStart: (state: PodState) => {
      state.loading = true;
    },
    fetchError: (
      state: PodState,
      action: PayloadAction<PodState["errors"]>
    ) => {
      state.errors = action.payload;
      state.loading = false;
    },
    fetchSuccess: (state: PodState, action) => {
      state.loading = false;
      state.loaded = true;
      action.payload.forEach((newItem: Pod) => {
        // If the item already exists, update it, otherwise
        // add it to the store.
        const existingIdx = state.items.findIndex(
          (draftItem: Pod) => draftItem.id === newItem.id
        );
        if (existingIdx !== -1) {
          state.items[existingIdx] = newItem;
        } else {
          state.items.push(newItem);
          // Set up the statuses for this machine.
          state.statuses[newItem.id] = DEFAULT_STATUSES;
        }
      });
    },
    get: {
      prepare: (podID: Pod["id"]) => ({
        meta: {
          model: "pod",
          method: "get",
        },
        payload: {
          params: { id: podID },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    getStart: (state: PodState, _action: PayloadAction<undefined>) => {
      state.loading = true;
    },
    getError: (state: PodState, action: PayloadAction<PodState["errors"]>) => {
      state.errors = action.payload;
      state.loading = false;
      state.saving = false;
    },
    getSuccess: (state: PodState, action: PayloadAction<Pod>) => {
      const pod = action.payload;
      // If the item already exists, update it, otherwise
      // add it to the store.
      const i = state.items.findIndex(
        (draftItem: Pod) => draftItem.id === pod.id
      );
      if (i !== -1) {
        state.items[i] = pod;
      } else {
        state.items.push(pod);
        // Set up the statuses for this pod.
        state.statuses[pod.id] = DEFAULT_STATUSES;
      }
      state.loading = false;
    },
    create: {
      prepare: (params) => ({
        meta: {
          model: "pod",
          method: "create",
        },
        payload: {
          params,
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    createStart: (state: PodState, _action: PayloadAction<undefined>) => {
      state.saved = false;
      state.saving = true;
    },
    createError: (
      state: PodState,
      action: PayloadAction<PodState["errors"]>
    ) => {
      state.errors = action.payload;
      state.saving = false;
    },
    createSuccess: (state: PodState) => {
      state.errors = {};
      state.saved = true;
      state.saving = false;
    },
    createNotify: (state: PodState, action) => {
      // In the event that the server erroneously attempts to create an existing machine,
      // due to a race condition etc., ensure we update instead of creating duplicates.
      const existingIdx = state.items.findIndex(
        (draftItem: Pod) => draftItem.id === action.payload.id
      );
      if (existingIdx !== -1) {
        state.items[existingIdx] = action.payload;
      } else {
        state.items.push(action.payload);
        state.statuses[action.payload.id] = DEFAULT_STATUSES;
      }
    },
    update: {
      prepare: (params) => ({
        meta: {
          model: "pod",
          method: "update",
        },
        payload: {
          params,
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    updateStart: (state: PodState) => {
      state.saved = false;
      state.saving = true;
    },
    updateError: (
      state: PodState,
      action: PayloadAction<PodState["errors"]>
    ) => {
      state.errors = action.payload;
      state.saving = false;
    },
    updateSuccess: (state: PodState) => {
      state.errors = {};
      state.saved = true;
      state.saving = false;
    },
    updateNotify: (state: PodState, action: PayloadAction<Pod>) => {
      for (const i in state.items) {
        if (state.items[i].id === action.payload.id) {
          state.items[i] = action.payload;
        }
      }
    },
    deleteNotify: (state: PodState, action) => {
      const index = state.items.findIndex(
        (item: Pod) => item.id === action.payload
      );
      state.items.splice(index, 1);
      state.selected = state.selected.filter(
        (podId: Pod["id"]) => podId !== action.payload
      );
      // Clean up the statuses for model.
      delete state.statuses[action.payload];
    },
    cleanup: (state: PodState) => {
      state.errors = {};
      state.saved = false;
      state.saving = false;
    },
    setSelected: {
      prepare: (podIDs: Pod["id"][]) => ({
        payload: podIDs,
      }),
      reducer: (state: PodState, action: PayloadAction<Pod["id"][]>) => {
        state.selected = action.payload;
      },
    },
    compose: {
      prepare: (params) => ({
        meta: {
          model: "pod",
          method: "compose",
        },
        payload: {
          params,
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    composeStart: {
      prepare: ({ item, payload }) => ({
        meta: {
          item,
        },
        payload,
      }),
      reducer: (
        state: PodState,
        action: PayloadAction<Pod, string, { item: Pod }>
      ) => {
        state.statuses[action.meta.item["id"]].composing = true;
      },
    },
    composeSuccess: {
      prepare: ({ item, payload }) => ({
        meta: {
          item,
        },
        payload,
      }),
      reducer: (
        state: PodState,
        action: PayloadAction<Pod, string, { item: Pod }>
      ) => {
        state.statuses[action.meta.item["id"]].composing = false;
      },
    },
    composeError: {
      prepare: ({ item, payload }) => ({
        meta: {
          item,
        },
        payload,
      }),
      reducer: (
        state: PodState,
        action: PayloadAction<Pod, string, { item: Pod }>
      ) => {
        state.errors = action.payload;
        state.statuses[action.meta.item["id"]].composing = false;
      },
    },
    delete: {
      prepare: (podID: Pod["id"]) => ({
        meta: {
          model: "pod",
          method: "delete",
        },
        payload: {
          params: { id: podID },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    deleteStart: {
      prepare: ({ item, payload }) => ({
        meta: {
          item,
        },
        payload,
      }),
      reducer: (
        state: PodState,
        action: PayloadAction<Pod, string, { item: Pod }>
      ) => {
        state.statuses[action.meta.item["id"]].deleting = true;
      },
    },
    deleteSuccess: {
      prepare: ({ item, payload }) => ({
        meta: {
          item,
        },
        payload,
      }),
      reducer: (
        state: PodState,
        action: PayloadAction<Pod, string, { item: Pod }>
      ) => {
        state.statuses[action.meta.item["id"]].deleting = false;
      },
    },
    deleteError: {
      prepare: ({ item, payload }) => ({
        meta: {
          item,
        },
        payload,
      }),
      reducer: (
        state: PodState,
        action: PayloadAction<Pod, string, { item: Pod }>
      ) => {
        state.errors = action.payload;
        state.statuses[action.meta.item["id"]].deleting = false;
      },
    },
    refresh: {
      prepare: (podID: Pod["id"]) => ({
        meta: {
          model: "pod",
          method: "refresh",
        },
        payload: {
          params: { id: podID },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    refreshStart: {
      prepare: ({ item, payload }) => ({
        meta: {
          item,
        },
        payload,
      }),
      reducer: (
        state: PodState,
        action: PayloadAction<Pod, string, { item: Pod }>
      ) => {
        state.statuses[action.meta.item["id"]].refreshing = true;
      },
    },
    refreshSuccess: {
      prepare: ({ item, payload }) => ({
        meta: {
          item,
        },
        payload,
      }),
      reducer: (
        state: PodState,
        action: PayloadAction<Pod, string, { item: Pod }>
      ) => {
        state.statuses[action.meta.item["id"]].refreshing = false;
        for (const i in state.items) {
          if (state.items[i].id === action.payload.id) {
            state.items[i] = action.payload;
            return;
          }
        }
      },
    },
    refreshError: {
      prepare: ({ item, payload }) => ({
        meta: {
          item,
        },
        payload,
      }),
      reducer: (
        state: PodState,
        action: PayloadAction<Pod, string, { item: Pod }>
      ) => {
        state.errors = action.payload;
        state.statuses[action.meta.item["id"]].refreshing = false;
      },
    },
  },
});

export const { actions } = podSlice;

export default podSlice.reducer;
