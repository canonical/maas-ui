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
  SetZoneParams,
  UnlinkSubnetParams,
} from "./types/actions";

import type { UpdateInterfaceParams } from "app/store/types/node";
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
  unlinkingSubnet: false,
  updatingInterface: false,
  settingZone: false,
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
  name: DeviceMeta.MODEL,
  initialState: {
    ...genericInitialState,
    active: null,
    eventErrors: [],
    selected: [],
    statuses: {},
  } as DeviceState,
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
          model: DeviceMeta.MODEL,
          method: "create_interface",
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
    // On the backend this endpoint is an alias for createInterface.
    createPhysical: {
      prepare: (params: CreatePhysicalParams) => ({
        meta: {
          model: DeviceMeta.MODEL,
          method: "create_physical",
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
    delete: {
      prepare: (system_id: Device[DeviceMeta.PK]) => ({
        meta: {
          model: DeviceMeta.MODEL,
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.DELETE,
            extra: {},
            system_id,
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    deleteError: statusHandlers.delete.error,
    deleteStart: statusHandlers.delete.start,
    deleteSuccess: statusHandlers.delete.success,
    deleteInterface: {
      prepare: (params: DeleteInterfaceParams) => ({
        meta: {
          model: DeviceMeta.MODEL,
          method: "delete_interface",
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
    get: {
      prepare: (id: Device[DeviceMeta.PK]) => ({
        meta: {
          model: DeviceMeta.MODEL,
          method: "get",
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
          model: DeviceMeta.MODEL,
          method: "link_subnet",
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
          model: DeviceMeta.MODEL,
          method: "set_active",
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
    setZone: {
      prepare: (params: SetZoneParams) => ({
        meta: {
          model: DeviceMeta.MODEL,
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.SET_ZONE,
            extra: { zone_id: params.zone_id },
            [DeviceMeta.PK]: params[DeviceMeta.PK],
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
          model: DeviceMeta.MODEL,
          method: "unlink_subnet",
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
          model: DeviceMeta.MODEL,
          method: "update_interface",
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
