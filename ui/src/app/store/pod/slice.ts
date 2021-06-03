import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { PodMeta } from "./types";
import type { Pod, PodProject, PodState, PodType, PodVM } from "./types";

import type { DomainMeta, Domain } from "app/store/domain/types";
import { generateStatusHandlers } from "app/store/utils";
import type { GenericItemMeta } from "app/store/utils";
import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";
import type { Zone, ZoneMeta } from "app/store/zone/types";

export const DEFAULT_STATUSES = {
  composing: false,
  deleting: false,
  refreshing: false,
};

type GetProjectsMeta = {
  password?: string;
  power_address: string;
  type: PodType;
};

type CreateParams = {
  name?: Pod["name"];
  tags?: string;
  zone?: Pod["zone"];
  pool?: Pod["pool"];
  cpu_over_commit_ratio?: Pod["cpu_over_commit_ratio"];
  memory_over_commit_ratio?: Pod["memory_over_commit_ratio"];
  default_storage_pool?: Pod["default_storage_pool"];
  default_macvlan_mode?: Pod["default_macvlan_mode"];
};

type UpdateParams = CreateParams & {
  [PodMeta.PK]: Pod[PodMeta.PK];
};

const statusHandlers = generateStatusHandlers<PodState, Pod, PodMeta.PK>(
  PodMeta.PK,
  [
    {
      status: "compose",
      statusKey: "composing",
    },
    {
      status: "delete",
      statusKey: "deleting",
    },
    {
      status: "refresh",
      statusKey: "refreshing",
      success: (state, action) => {
        for (const i in state.items) {
          if (state.items[i].id === action.payload.id) {
            state.items[i] = action.payload;
            return;
          }
        }
      },
    },
  ]
);

const podSlice = createSlice({
  name: PodMeta.MODEL,
  initialState: {
    ...genericInitialState,
    active: null,
    projects: {},
    statuses: {},
  } as PodState,
  reducers: {
    ...generateCommonReducers<PodState, PodMeta.PK, CreateParams, UpdateParams>(
      PodMeta.MODEL,
      PodMeta.PK
    ),
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
    compose: {
      prepare: (params: {
        architecture?: Pod["architectures"][0];
        cores?: PodVM["pinned_cores"][0];
        cpu_speed?: Pod["cpu_speed"];
        domain?: Domain[DomainMeta.PK];
        hostname?: Pod["name"];
        hugepages_backed?: PodVM["hugepages_backed"];
        interfaces?: string;
        memory?: PodVM["memory"];
        pinned_cores?: PodVM["pinned_cores"];
        pool?: Pod["pool"];
        skip_commissioning?: boolean;
        storage?: string;
        zone?: Zone[ZoneMeta.PK];
      }) => ({
        meta: {
          model: PodMeta.MODEL,
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
    composeError: statusHandlers.compose.error,
    composeStart: statusHandlers.compose.start,
    composeSuccess: statusHandlers.compose.success,
    delete: {
      prepare: ({
        decompose = false,
        id,
      }: {
        decompose?: boolean;
        id: Pod[PodMeta.PK];
      }) => ({
        meta: {
          model: PodMeta.MODEL,
          method: "delete",
        },
        payload: {
          params: { decompose, id },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    deleteError: statusHandlers.delete.error,
    deleteStart: statusHandlers.delete.start,
    deleteSuccess: statusHandlers.delete.success,
    deleteNotify: (state: PodState, action) => {
      const index = state.items.findIndex(
        (item: Pod) => item.id === action.payload
      );
      state.items.splice(index, 1);
      // Clean up the statuses for model.
      delete state.statuses[action.payload];
    },
    fetchSuccess: (state: PodState, action: PayloadAction<Pod[]>) => {
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
      prepare: (podID: Pod[PodMeta.PK]) => ({
        meta: {
          model: PodMeta.MODEL,
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
    getStart: (state: PodState) => {
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
    getProjects: {
      prepare: (params: {
        type: PodType;
        power_address: string;
        password?: string;
      }) => ({
        meta: {
          model: PodMeta.MODEL,
          method: "get_projects",
        },
        payload: {
          params,
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    getProjectsSuccess: {
      prepare: (
        item: {
          type: PodType;
          power_address: string;
          password?: string;
        },
        payload: PodProject[]
      ) => ({
        meta: {
          item,
        },
        payload,
      }),
      reducer: (
        state: PodState,
        action: PayloadAction<
          PodProject[],
          string,
          GenericItemMeta<GetProjectsMeta>
        >
      ) => {
        const address = action.meta.item.power_address;
        if (address) {
          state.projects[address] = action.payload;
        }
      },
    },
    getProjectsError: (
      state: PodState,
      action: PayloadAction<PodState["errors"]>
    ) => {
      state.errors = action.payload;
    },
    refresh: {
      prepare: (id: Pod[PodMeta.PK]) => ({
        meta: {
          model: PodMeta.MODEL,
          method: "refresh",
        },
        payload: {
          params: { id },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    refreshError: statusHandlers.refresh.error,
    refreshStart: statusHandlers.refresh.start,
    refreshSuccess: statusHandlers.refresh.success,
    setActive: {
      prepare: (id: Pod[PodMeta.PK] | null) => ({
        meta: {
          model: PodMeta.MODEL,
          method: "set_active",
        },
        payload: {
          // Server unsets active pod if primary key (id) is not sent.
          params: id === null ? null : { id },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    setActiveError: (
      state: PodState,
      action: PayloadAction<PodState["errors"]>
    ) => {
      state.active = null;
      state.errors = action.payload;
    },
    setActiveSuccess: (state: PodState, action: PayloadAction<Pod | null>) => {
      state.active = action.payload?.id || null;
    },
  },
});

export const { actions } = podSlice;

export default podSlice.reducer;
