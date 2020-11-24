import type {
  CaseReducer,
  PayloadAction,
  PrepareAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";

import type { Machine, MachineState } from "./types";

import { generateSlice, generateStatusHandlers } from "app/store/utils";
import type { GenericSlice } from "app/store/utils";
import type { StatusHandlers } from "app/store/utils/slice";
import { kebabToCamelCase } from "app/utils";

import type { ScriptResult } from "app/store/scriptresults/types";
import type { Scripts } from "app/store/scripts/types";

export type ScriptInput = {
  [x: string]: { url: string };
};

export const ACTIONS = [
  {
    name: "abort",
    status: "aborting",
  },
  {
    name: "acquire",
    status: "acquiring",
  },
  {
    name: "apply-storage-layout",
    status: "applyingStorageLayout",
  },
  {
    name: "check-power",
    status: "checkingPower",
  },
  {
    name: "commission",
    status: "commissioning",
  },
  {
    name: "delete",
    status: "deleting",
  },
  {
    name: "deploy",
    status: "deploying",
  },
  {
    name: "rescue-mode",
    status: "enteringRescueMode",
  },
  {
    name: "exit-rescue-mode",
    status: "exitingRescueMode",
  },
  {
    name: "lock",
    status: "locking",
  },
  {
    name: "mark-broken",
    status: "markingBroken",
  },
  {
    name: "mark-fixed",
    status: "markingFixed",
  },
  {
    name: "mount-special",
    status: "mountingSpecial",
  },
  {
    name: "override-failed-testing",
    status: "overridingFailedTesting",
  },
  {
    name: "release",
    status: "releasing",
  },
  {
    name: "set-pool",
    status: "settingPool",
  },
  {
    name: "set-zone",
    status: "settingZone",
  },
  {
    name: "tag",
    status: "tagging",
  },
  {
    name: "test",
    status: "testing",
  },
  {
    name: "off",
    status: "turningOff",
  },
  {
    name: "on",
    status: "turningOn",
  },
  {
    name: "unlock",
    status: "unlocking",
  },
];

const DEFAULT_STATUSES = {
  aborting: false,
  acquiring: false,
  applyingStorageLayout: false,
  checkingPower: false,
  commissioning: false,
  deleting: false,
  deploying: false,
  enteringRescueMode: false,
  exitingRescueMode: false,
  locking: false,
  markingBroken: false,
  markingFixed: false,
  mountingSpecial: false,
  overridingFailedTesting: false,
  releasing: false,
  settingPool: false,
  settingZone: false,
  tagging: false,
  testing: false,
  turningOff: false,
  turningOn: false,
  unlocking: false,
};

type WithPrepare = {
  reducer: CaseReducer<MachineState, PayloadAction<unknown>>;
  prepare: PrepareAction<unknown>;
};

type MachineReducers = SliceCaseReducers<MachineState> & {
  // Overrides for reducers that don't take a payload.
  abort: WithPrepare;
  acquire: WithPrepare;
  applyStorageLayout: WithPrepare;
  checkPower: WithPrepare;
  commission: WithPrepare;
  delete: WithPrepare;
  deploy: WithPrepare;
  fetchComplete: CaseReducer<MachineState, PayloadAction<void>>;
  getStart: CaseReducer<MachineState, PayloadAction<void>>;
  rescueMode: WithPrepare;
  exitRescueMode: WithPrepare;
  lock: WithPrepare;
  markBroken: WithPrepare;
  markFixed: WithPrepare;
  mountSpecial: WithPrepare;
  overrideFailedTesting: WithPrepare;
  release: WithPrepare;
  setPool: WithPrepare;
  setZone: WithPrepare;
  suppressScriptResults: WithPrepare;
  tag: WithPrepare;
  test: WithPrepare;
  off: WithPrepare;
  on: WithPrepare;
  unlock: WithPrepare;
};

const statusHandlers = generateStatusHandlers<
  MachineState,
  Machine,
  "system_id"
>(
  "machine",
  "system_id",
  ACTIONS.map((action) => {
    const handler: StatusHandlers<MachineState, Machine> = {
      status: kebabToCamelCase(action.name),
      method: "action",
      statusKey: action.status,
      prepare: (systemId: Machine["system_id"]) => ({
        action: action.name,
        extra: {},
        system_id: systemId,
      }),
    };
    switch (action.name) {
      case "apply-storage-layout":
        handler.method = "apply_storage_layout";
        handler.prepare = (
          systemId: Machine["system_id"],
          storageLayout: string
        ) => ({
          storage_layout: storageLayout,
          system_id: systemId,
        });
        break;
      case "check-power":
        handler.method = "check_power";
        handler.prepare = (systemId: Machine["system_id"]) => ({
          system_id: systemId,
        });
        break;
      case "mark-broken":
        handler.prepare = (systemId: Machine["system_id"], message) => ({
          action: action.name,
          extra: { message },
          system_id: systemId,
        });
        break;
      case "commission":
        handler.prepare = (
          systemId: Machine["system_id"],
          enableSSH: boolean,
          skipBMCConfig: boolean,
          skipNetworking: boolean,
          skipStorage: boolean,
          updateFirmware: boolean,
          configureHBA: boolean,
          commissioningScripts: Scripts[],
          testingScripts: Scripts[],
          scriptInputs: ScriptInput[]
        ) => {
          let formattedCommissioningScripts: (string | Scripts["id"])[] = [];
          if (commissioningScripts && commissioningScripts.length > 0) {
            formattedCommissioningScripts = commissioningScripts.map(
              (script) => script.id
            );
            if (updateFirmware) {
              formattedCommissioningScripts.push("update_firmware");
            }
            if (configureHBA) {
              formattedCommissioningScripts.push("configure_hba");
            }
          }
          return {
            action: action.name,
            system_id: systemId,
            extra: {
              enable_ssh: enableSSH,
              skip_bmc_config: skipBMCConfig,
              skip_networking: skipNetworking,
              skip_storage: skipStorage,
              commissioning_scripts: formattedCommissioningScripts,
              testing_scripts:
                testingScripts && testingScripts.map((script) => script.id),
              script_input: scriptInputs,
            },
          };
        };
        break;
      case "deploy":
        handler.prepare = (systemId: Machine["system_id"], extra = {}) => ({
          action: action.name,
          extra,
          system_id: systemId,
        });
        break;
      case "mount-special":
        handler.method = "mount_special";
        handler.prepare = (params: {
          filesystemType: string;
          mountOptions: string;
          mountPoint: string;
          systemId: Machine["system_id"];
        }) => ({
          fstype: params.filesystemType,
          mount_options: params.mountOptions,
          mount_point: params.mountPoint,
          system_id: params.systemId,
        });
        break;
      case "set-pool":
        handler.prepare = (systemId: Machine["system_id"], poolId) => ({
          action: action.name,
          extra: { pool_id: poolId },
          system_id: systemId,
        });
        break;
      case "set-zone":
        handler.prepare = (systemId: Machine["system_id"], zoneId) => ({
          action: action.name,
          extra: { zone_id: zoneId },
          system_id: systemId,
        });
        break;
      case "test":
        handler.prepare = (
          systemId: Machine["system_id"],
          scripts: Scripts[],
          enableSSH: boolean,
          scriptInputs: ScriptInput
        ) => ({
          action: action.name,
          extra: {
            enable_ssh: enableSSH,
            script_input: scriptInputs,
            testing_scripts: scripts && scripts.map((script) => script.id),
          },
          system_id: systemId,
        });
        break;
      case "tag":
        handler.prepare = (systemId: Machine["system_id"], tags: string[]) => ({
          action: action.name,
          extra: {
            tags,
          },
          system_id: systemId,
        });
        break;
    }
    return handler;
  })
) as MachineReducers;

export type MachineSlice = GenericSlice<MachineState, Machine, MachineReducers>;

const machineSlice = generateSlice<
  Machine,
  MachineState["errors"],
  MachineReducers,
  "system_id"
>({
  indexKey: "system_id",
  initialState: {
    active: null,
    selected: [],
    statuses: {},
  } as MachineState,
  name: "machine",
  reducers: {
    // Explicitly assign generated status handlers so that the dynamically
    // generated names exist on the reducers object.
    abort: statusHandlers.abort,
    abortStart: statusHandlers.abortStart,
    abortSuccess: statusHandlers.abortSuccess,
    abortError: statusHandlers.abortError,
    acquire: statusHandlers.acquire,
    acquireStart: statusHandlers.acquireStart,
    acquireSuccess: statusHandlers.acquireSuccess,
    acquireError: statusHandlers.acquireError,
    applyStorageLayout: statusHandlers.applyStorageLayout,
    applyStorageLayoutStart: statusHandlers.applyStorageLayoutStart,
    applyStorageLayoutSuccess: statusHandlers.applyStorageLayoutSuccess,
    applyStorageLayoutError: statusHandlers.applyStorageLayoutError,
    checkPower: statusHandlers.checkPower,
    checkPowerStart: statusHandlers.checkPowerStart,
    checkPowerSuccess: statusHandlers.checkPowerSuccess,
    checkPowerError: statusHandlers.checkPowerError,
    commission: statusHandlers.commission,
    commissionStart: statusHandlers.commissionStart,
    commissionSuccess: statusHandlers.commissionSuccess,
    commissionError: statusHandlers.commissionError,
    delete: statusHandlers.delete,
    deleteStart: statusHandlers.deleteStart,
    deleteSuccess: statusHandlers.deleteSuccess,
    deleteError: statusHandlers.deleteError,
    deploy: statusHandlers.deploy,
    deployStart: statusHandlers.deployStart,
    deploySuccess: statusHandlers.deploySuccess,
    deployError: statusHandlers.deployError,
    rescueMode: statusHandlers.rescueMode,
    rescueModeStart: statusHandlers.rescueModeStart,
    rescueModeSuccess: statusHandlers.rescueModeSuccess,
    rescueModeError: statusHandlers.rescueModeError,
    exitRescueMode: statusHandlers.exitRescueMode,
    exitRescueModeStart: statusHandlers.exitRescueModeStart,
    exitRescueModeSuccess: statusHandlers.exitRescueModeSuccess,
    exitRescueModeError: statusHandlers.exitRescueModeError,
    lock: statusHandlers.lock,
    lockStart: statusHandlers.lockStart,
    lockSuccess: statusHandlers.lockSuccess,
    lockError: statusHandlers.lockError,
    markBroken: statusHandlers.markBroken,
    markBrokenStart: statusHandlers.markBrokenStart,
    markBrokenSuccess: statusHandlers.markBrokenSuccess,
    markBrokenError: statusHandlers.markBrokenError,
    markFixed: statusHandlers.markFixed,
    markFixedStart: statusHandlers.markFixedStart,
    markFixedSuccess: statusHandlers.markFixedSuccess,
    markFixedError: statusHandlers.markFixedError,
    mountSpecial: statusHandlers.mountSpecial,
    mountSpecialStart: statusHandlers.mountSpecialStart,
    mountSpecialSuccess: statusHandlers.mountSpecialSuccess,
    mountSpecialError: statusHandlers.mountSpecialError,
    overrideFailedTesting: statusHandlers.overrideFailedTesting,
    overrideFailedTestingStart: statusHandlers.overrideFailedTestingStart,
    overrideFailedTestingSuccess: statusHandlers.overrideFailedTestingSuccess,
    overrideFailedTestingError: statusHandlers.overrideFailedTestingError,
    release: statusHandlers.release,
    releaseStart: statusHandlers.releaseStart,
    releaseSuccess: statusHandlers.releaseSuccess,
    releaseError: statusHandlers.releaseError,
    setPool: statusHandlers.setPool,
    setPoolStart: statusHandlers.setPoolStart,
    setPoolSuccess: statusHandlers.setPoolSuccess,
    setPoolError: statusHandlers.setPoolError,
    setZone: statusHandlers.setZone,
    setZoneStart: statusHandlers.setZoneStart,
    setZoneSuccess: statusHandlers.setZoneSuccess,
    setZoneError: statusHandlers.setZoneError,
    tag: statusHandlers.tag,
    tagStart: statusHandlers.tagStart,
    tagSuccess: statusHandlers.tagSuccess,
    tagError: statusHandlers.tagError,
    test: statusHandlers.test,
    testStart: statusHandlers.testStart,
    testSuccess: statusHandlers.testSuccess,
    testError: statusHandlers.testError,
    off: statusHandlers.off,
    offStart: statusHandlers.offStart,
    offSuccess: statusHandlers.offSuccess,
    offError: statusHandlers.offError,
    on: statusHandlers.on,
    onStart: statusHandlers.onStart,
    onSuccess: statusHandlers.onSuccess,
    onError: statusHandlers.onError,
    unlock: statusHandlers.unlock,
    unlockStart: statusHandlers.unlockStart,
    unlockSuccess: statusHandlers.unlockSuccess,
    unlockError: statusHandlers.unlockError,
    fetch: {
      prepare: () => ({
        meta: {
          model: "machine",
          method: "list",
          subsequentLimit: 100,
        },
        payload: {
          params: { limit: 25 },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    fetchComplete: (state: MachineState) => {
      state.loading = false;
      state.loaded = true;
    },
    fetchSuccess: (state: MachineState, action: PayloadAction<Machine[]>) => {
      action.payload.forEach((newItem: Machine) => {
        // If the item already exists, update it, otherwise
        // add it to the store.
        const existingIdx = state.items.findIndex(
          (draftItem: Machine) => draftItem.id === newItem.id
        );
        if (existingIdx !== -1) {
          state.items[existingIdx] = newItem;
        } else {
          state.items.push(newItem);
          // Set up the statuses for this machine.
          state.statuses[newItem.system_id] = DEFAULT_STATUSES;
        }
      });
    },
    get: {
      prepare: (machineID: Machine["system_id"]) => ({
        meta: {
          model: "machine",
          method: "get",
        },
        payload: {
          params: { system_id: machineID },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    getStart: (state: MachineState) => {
      state.loading = true;
    },
    getError: (
      state: MachineState,
      action: PayloadAction<MachineState["errors"]>
    ) => {
      state.errors = action.payload;
      state.loading = false;
      state.saving = false;
    },
    getSuccess: (state: MachineState, action: PayloadAction<Machine>) => {
      const machine = action.payload;
      // If the item already exists, update it, otherwise
      // add it to the store.
      const i = state.items.findIndex(
        (draftItem: Machine) => draftItem.system_id === machine.system_id
      );
      if (i !== -1) {
        state.items[i] = machine;
      } else {
        state.items.push(machine);
        // Set up the statuses for this machine.
        state.statuses[machine.system_id] = DEFAULT_STATUSES;
      }
      state.loading = false;
    },
    setActive: {
      prepare: (system_id: Machine["system_id"] | null) => ({
        meta: {
          model: "machine",
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
      state: MachineState,
      action: PayloadAction<MachineState["errors"][0]>
    ) => {
      state.active = null;
      state.errors = action.payload;
    },
    setActiveSuccess: (
      state: MachineState,
      action: PayloadAction<Machine | null>
    ) => {
      state.active = action.payload?.system_id || null;
    },
    createNotify: (state: MachineState, action) => {
      // In the event that the server erroneously attempts to create an existing machine,
      // due to a race condition etc., ensure we update instead of creating duplicates.
      const existingIdx = state.items.findIndex(
        (draftItem: Machine) => draftItem.id === action.payload.id
      );
      if (existingIdx !== -1) {
        state.items[existingIdx] = action.payload;
      } else {
        state.items.push(action.payload);
        state.statuses[action.payload.system_id] = DEFAULT_STATUSES;
      }
    },
    addChassis: {
      prepare: (params: { [x: string]: string }) => ({
        payload: {
          params,
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    addChassisStart: (state: MachineState) => {
      state.saved = false;
      state.saving = true;
    },
    addChassisError: (
      state: MachineState,
      action: PayloadAction<MachineState["errors"]>
    ) => {
      state.errors = action.payload;
      state.loading = false;
      state.saving = false;
    },
    addChassisSuccess: (state: MachineState) => {
      state.errors = null;
      state.saved = true;
      state.saving = false;
    },
    setSelected: {
      prepare: (machineIDs: Machine["system_id"][]) => ({
        payload: machineIDs,
      }),
      reducer: (
        state: MachineState,
        action: PayloadAction<Machine["system_id"][]>
      ) => {
        state.selected = action.payload;
      },
    },
    suppressScriptResults: {
      prepare: (machineID: Machine["system_id"], scripts: ScriptResult[]) => ({
        meta: {
          model: "machine",
          method: "set_script_result_suppressed",
        },
        payload: {
          params: {
            system_id: machineID,
            script_result_ids: scripts.map((script) => script.id),
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    deleteNotify: (state: MachineState, action) => {
      const index = state.items.findIndex(
        (item: Machine) => item.system_id === action.payload
      );
      state.items.splice(index, 1);
      state.selected = state.selected.filter(
        (machineId: Machine["system_id"]) => machineId !== action.payload
      );
      // Clean up the statuses for model.
      delete state.statuses[action.payload];
    },
  },
}) as MachineSlice;

export const { actions } = machineSlice;

export default machineSlice.reducer;
