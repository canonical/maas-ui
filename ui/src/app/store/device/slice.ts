import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { DeviceMeta } from "./types";
import type {
  CreateInterfaceParams,
  CreateParams,
  DeviceState,
  UpdateParams,
  Device,
} from "./types";
import type {
  CreatePhysicalParams,
  DeleteInterfaceParams,
  LinkSubnetParams,
  UnlinkSubnetParams,
} from "./types/actions";

import type {
  BaseNodeActionParams,
  SetZoneParams,
  UpdateInterfaceParams,
} from "app/store/types/node";
import { NodeActions } from "app/store/types/node";
import {
  generateCommonReducers,
  generateStatusHandlers,
  genericInitialState,
  updateErrors,
} from "app/store/utils/slice";
import { kebabToCamelCase, preparePayloadParams } from "app/utils";

export const DEFAULT_STATUSES = {
  creatingInterface: false,
  creatingPhysical: false,
  deleting: false,
  deletingInterface: false,
  linkingSubnet: false,
  settingZone: false,
  unlinkingSubnet: false,
  updatingInterface: false,
};

const setErrors = (
  state: DeviceState,
  action: PayloadAction<DeviceState["errors"]> | null,
  event: string | null
): DeviceState =>
  updateErrors<DeviceState, DeviceMeta.PK>(state, action, event, DeviceMeta.PK);

const statusHandlers = generateStatusHandlers<
  DeviceState,
  Device,
  DeviceMeta.PK
>(
  DeviceMeta.PK,
  [
    {
      status: "createInterface",
      statusKey: "creatingInterface",
    },
    {
      status: "createPhysical",
      statusKey: "creatingPhysical",
    },
    {
      status: NodeActions.DELETE,
      statusKey: "deleting",
    },
    {
      status: "deleteInterface",
      statusKey: "deletingInterface",
    },
    {
      status: "linkSubnet",
      statusKey: "linkingSubnet",
    },
    {
      status: "unlinkSubnet",
      statusKey: "unlinkingSubnet",
    },
    {
      status: kebabToCamelCase(NodeActions.SET_ZONE),
      statusKey: "settingZone",
    },
    {
      status: "updateInterface",
      statusKey: "updatingInterface",
    },
  ],
  setErrors
);

const deviceSlice = createSlice({
  initialState: {
    ...genericInitialState,
    active: null,
    eventErrors: [],
    selected: [],
    statuses: {},
  } as DeviceState,
  name: DeviceMeta.MODEL,
  reducers: {
    ...generateCommonReducers<
      DeviceState,
      DeviceMeta.PK,
      CreateParams,
      UpdateParams
    >(DeviceMeta.MODEL, DeviceMeta.PK, setErrors),
    createInterface: {
      prepare: (params: CreateInterfaceParams) => ({
        meta: {
          method: "create_interface",
          model: DeviceMeta.MODEL,
        },
        payload: {
          params: preparePayloadParams(params),
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    createInterfaceError: statusHandlers.createInterface.error,
    createInterfaceStart: statusHandlers.createInterface.start,
    createInterfaceSuccess: statusHandlers.createInterface.success,
    createNotify: (state: DeviceState, action: PayloadAction<Device>) => {
      // In the event that the server erroneously attempts to create an existing device,
      // due to a race condition etc., ensure we update instead of creating duplicates.
      const existingIdx = state.items.findIndex(
        (draftItem: Device) => draftItem.system_id === action.payload.system_id
      );
      if (existingIdx !== -1) {
        state.items[existingIdx] = action.payload;
      } else {
        state.items.push(action.payload);
        state.statuses[action.payload.system_id] = DEFAULT_STATUSES;
      }
    },
    // On the backend this endpoint is an alias for createInterface.
    createPhysical: {
      prepare: (params: CreatePhysicalParams) => ({
        meta: {
          method: "create_physical",
          model: DeviceMeta.MODEL,
        },
        payload: {
          params: preparePayloadParams(params),
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    createPhysicalError: statusHandlers.createPhysical.error,
    createPhysicalStart: statusHandlers.createPhysical.start,
    createPhysicalSuccess: statusHandlers.createPhysical.success,
    delete: {
      prepare: (params: BaseNodeActionParams) => ({
        meta: {
          method: "action",
          model: DeviceMeta.MODEL,
        },
        payload: {
          params: {
            action: NodeActions.DELETE,
            extra: {},
            system_id: params.system_id,
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    deleteError: statusHandlers.delete.error,
    deleteInterface: {
      prepare: (params: DeleteInterfaceParams) => ({
        meta: {
          method: "delete_interface",
          model: DeviceMeta.MODEL,
        },
        payload: {
          params: preparePayloadParams(params),
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    deleteInterfaceError: statusHandlers.deleteInterface.error,
    deleteInterfaceStart: statusHandlers.deleteInterface.start,
    deleteInterfaceSuccess: statusHandlers.deleteInterface.success,
    deleteNotify: (
      state: DeviceState,
      action: PayloadAction<Device[DeviceMeta.PK]>
    ) => {
      const index = state.items.findIndex(
        (item: Device) => item.system_id === action.payload
      );
      state.items.splice(index, 1);
      state.selected = state.selected.filter(
        (deviceId: Device[DeviceMeta.PK]) => deviceId !== action.payload
      );
      // Clean up the statuses for model.
      delete state.statuses[action.payload];
    },
    deleteStart: statusHandlers.delete.start,
    deleteSuccess: statusHandlers.delete.success,
    fetchSuccess: (state: DeviceState, action: PayloadAction<Device[]>) => {
      action.payload.forEach((newItem: Device) => {
        // Add items that don't already exist in the store. Existing items
        // are probably DeviceDetails so this would overwrite them with the
        // simple device. Existing items will be kept up to date via the
        // notify (sync) messages.
        const existing = state.items.find(
          (draftItem: Device) => draftItem.id === newItem.id
        );
        if (!existing) {
          state.items.push(newItem);
          // Set up the statuses for this device.
          state.statuses[newItem.system_id] = DEFAULT_STATUSES;
        }
      });
      state.loading = false;
      state.loaded = true;
    },
    get: {
      prepare: (id: Device[DeviceMeta.PK]) => ({
        meta: {
          method: "get",
          model: DeviceMeta.MODEL,
        },
        payload: {
          params: { [DeviceMeta.PK]: id },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    getError: (
      state: DeviceState,
      action: PayloadAction<DeviceState["errors"]>
    ) => {
      state.errors = action.payload;
      state = setErrors(state, action, "get");
      state.loading = false;
      state.saving = false;
    },
    getStart: (state: DeviceState) => {
      state.loading = true;
    },
    getSuccess: (state: DeviceState, action: PayloadAction<Device>) => {
      const device = action.payload;
      // If the item already exists, update it, otherwise
      // add it to the store.
      const i = state.items.findIndex(
        (draftItem: Device) =>
          draftItem[DeviceMeta.PK] === device[DeviceMeta.PK]
      );
      if (i !== -1) {
        state.items[i] = device;
      } else {
        state.items.push(device);
        // Set up the statuses for this device.
        state.statuses[device[DeviceMeta.PK]] = DEFAULT_STATUSES;
      }
      state.loading = false;
    },
    linkSubnet: {
      prepare: (params: LinkSubnetParams) => ({
        meta: {
          method: "link_subnet",
          model: DeviceMeta.MODEL,
        },
        payload: {
          params: preparePayloadParams(params),
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    linkSubnetError: statusHandlers.linkSubnet.error,
    linkSubnetStart: statusHandlers.linkSubnet.start,
    linkSubnetSuccess: statusHandlers.linkSubnet.success,
    setActive: {
      prepare: (system_id: Device[DeviceMeta.PK] | null) => ({
        meta: {
          method: "set_active",
          model: DeviceMeta.MODEL,
        },
        payload: {
          // Server unsets active item if primary key (system_id) is not sent.
          params: system_id ? { system_id } : null,
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    setActiveError: (
      state: DeviceState,
      action: PayloadAction<DeviceState["errors"]>
    ) => {
      state.active = null;
      state.errors = action.payload;
      state = setErrors(state, action, "setActive");
    },
    setActiveSuccess: (
      state: DeviceState,
      action: PayloadAction<Device | null>
    ) => {
      state.active = action.payload?.system_id || null;
    },
    setSelected: (
      state: DeviceState,
      action: PayloadAction<Device[DeviceMeta.PK][]>
    ) => {
      state.selected = action.payload;
    },
    setZone: {
      prepare: (params: SetZoneParams) => ({
        meta: {
          method: "action",
          model: DeviceMeta.MODEL,
        },
        payload: {
          params: {
            action: NodeActions.SET_ZONE,
            extra: {
              zone_id: params.zone_id,
            },
            system_id: params.system_id,
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    setZoneError: statusHandlers.setZone.error,
    setZoneStart: statusHandlers.setZone.start,
    setZoneSuccess: statusHandlers.setZone.success,
    unlinkSubnet: {
      prepare: (params: UnlinkSubnetParams) => ({
        meta: {
          method: "unlink_subnet",
          model: DeviceMeta.MODEL,
        },
        payload: {
          params: preparePayloadParams(params),
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    unlinkSubnetError: statusHandlers.unlinkSubnet.error,
    unlinkSubnetStart: statusHandlers.unlinkSubnet.start,
    unlinkSubnetSuccess: statusHandlers.unlinkSubnet.success,
    updateInterface: {
      prepare: (
        // This update endpoint is used for updating all interface types so
        // must allow all possible parameters.
        params: UpdateInterfaceParams
      ) => ({
        meta: {
          method: "update_interface",
          model: DeviceMeta.MODEL,
        },
        payload: {
          params: preparePayloadParams(params),
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    updateInterfaceError: statusHandlers.updateInterface.error,
    updateInterfaceStart: statusHandlers.updateInterface.start,
    updateInterfaceSuccess: statusHandlers.updateInterface.success,
  },
});

export const { actions } = deviceSlice;

export default deviceSlice.reducer;
