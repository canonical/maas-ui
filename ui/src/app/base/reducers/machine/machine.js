import { createNextState } from "@reduxjs/toolkit";

export const ACTIONS = [
  {
    status: "aborting",
    type: "ABORT_MACHINE",
  },
  {
    status: "acquiring",
    type: "ACQUIRE_MACHINE",
  },
  {
    status: "checkingPower",
    type: "CHECK_MACHINE_POWER",
  },
  {
    status: "commissioning",
    type: "COMMISSION_MACHINE",
  },
  {
    status: "deleting",
    type: "DELETE_MACHINE",
  },
  {
    status: "deploying",
    type: "DEPLOY_MACHINE",
  },
  {
    status: "enteringRescueMode",
    type: "MACHINE_RESCUE_MODE",
  },
  {
    status: "exitingRescueMode",
    type: "MACHINE_EXIT_RESCUE_MODE",
  },
  {
    status: "locking",
    type: "LOCK_MACHINE",
  },
  {
    status: "markingBroken",
    type: "MARK_MACHINE_BROKEN",
  },
  {
    status: "markingFixed",
    type: "MARK_MACHINE_FIXED",
  },
  {
    status: "overridingFailedTesting",
    type: "MACHINE_OVERRIDE_FAILED_TESTING",
  },
  {
    status: "releasing",
    type: "RELEASE_MACHINE",
  },
  {
    status: "settingPool",
    type: "SET_MACHINE_POOL",
  },
  {
    status: "settingZone",
    type: "SET_MACHINE_ZONE",
  },
  {
    status: "tagging",
    type: "TAG_MACHINE",
  },
  {
    status: "testing",
    type: "TEST_MACHINE",
  },
  {
    status: "turningOff",
    type: "TURN_MACHINE_OFF",
  },
  {
    status: "turningOn",
    type: "TURN_MACHINE_ON_ERROR",
  },
  {
    status: "unlocking",
    type: "UNLOCK_MACHINE",
  },
];

let DEFAULT_STATUSES = {};
ACTIONS.forEach(({ status }) => {
  DEFAULT_STATUSES[status] = false;
});

const machine = createNextState(
  (draft, action) => {
    // Handle actions that have the same shape.
    ACTIONS.forEach(({ status, type }) => {
      switch (action.type) {
        case `${type}_START`:
          draft.errors = {};
          draft.statuses[action.meta.item.system_id][status] = true;
          break;
        case `${type}_SUCCESS`:
          if (status !== "deleting") {
            // Sometimes the server will respond with "DELETE_MACHINE_NOTIFY"
            // before "DELETE_MACHINE_SUCCESS", which removes the machine
            // system_id from statuses.
            draft.statuses[action.meta.item.system_id][status] = false;
          }
          break;
        case `${type}_ERROR`:
          draft.statuses[action.meta.item.system_id][status] = false;
          draft.errors = action.error;
          break;
        default:
          break;
      }
    });
    switch (action.type) {
      case "FETCH_MACHINE_START":
      case "GET_MACHINE_START":
        draft.loading = true;
        break;
      case "FETCH_MACHINE_COMPLETE":
        draft.loading = false;
        draft.loaded = true;
        break;
      case "FETCH_MACHINE_SUCCESS":
        action.payload.forEach((newItem) => {
          // If the item already exists, update it, otherwise
          // add it to the store.
          const existingIdx = draft.items.findIndex(
            (draftItem) => draftItem.id === newItem.id
          );
          if (existingIdx !== -1) {
            draft.items[existingIdx] = newItem;
          } else {
            draft.items.push(newItem);
            // Set up the statuses for this machine.
            draft.statuses[newItem.system_id] = DEFAULT_STATUSES;
          }
        });
        break;
      case "ADD_MACHINE_CHASSIS_START":
      case "CREATE_MACHINE_START":
        draft.saved = false;
        draft.saving = true;
        break;
      case "ADD_MACHINE_CHASSIS_SUCCESS":
      case "CREATE_MACHINE_SUCCESS":
        draft.errors = {};
        draft.saved = true;
        draft.saving = false;
        break;
      case "ADD_MACHINE_CHASSIS_ERROR":
      case "FETCH_MACHINE_ERROR":
      case "GET_MACHINE_ERROR":
      case "CREATE_MACHINE_ERROR":
        draft.errors = action.error;
        draft.loading = false;
        draft.saving = false;
        break;
      case "CREATE_MACHINE_NOTIFY":
        // In the event that the server erroneously attempts to create an existing machine,
        // due to a race condition etc., ensure we update instead of creating duplicates.
        const existingIdx = draft.items.findIndex(
          (draftItem) => draftItem.id === action.payload.id
        );
        if (existingIdx !== -1) {
          draft.items[existingIdx] = action.payload;
        } else {
          draft.items.push(action.payload);
          draft.statuses[action.payload.system_id] = DEFAULT_STATUSES;
        }
        break;
      case "DELETE_MACHINE_NOTIFY":
        draft.items = draft.items.filter(
          (machine) => machine.system_id !== action.payload
        );
        draft.selected = draft.selected.filter(
          (machineId) => machineId !== action.payload
        );
        // Clean up the statuses for this machine.
        delete draft.statuses[action.payload];
        break;
      case "UPDATE_MACHINE_NOTIFY":
        for (let i in draft.items) {
          if (draft.items[i].id === action.payload.id) {
            draft.items[i] = action.payload;
            break;
          }
        }
        break;
      case "GET_MACHINE_SUCCESS":
        const machine = action.payload;
        // If the item already exists, update it, otherwise
        // add it to the store.
        const i = draft.items.findIndex(
          (draftItem) => draftItem.system_id === machine.system_id
        );
        if (i !== -1) {
          draft.items[i] = machine;
        } else {
          draft.items.push(machine);
          // Set up the statuses for this machine.
          draft.statuses[machine.system_id] = DEFAULT_STATUSES;
        }
        draft.loading = false;
        break;
      case "SET_SELECTED_MACHINES":
        draft.selected = action.payload;
        break;
      case "CLEANUP_MACHINE":
        draft.errors = {};
        draft.saved = false;
        draft.saving = false;
        break;
      default:
        return draft;
    }
  },
  {
    errors: {},
    items: [],
    loaded: false,
    loading: false,
    saved: false,
    saving: false,
    selected: [],
    statuses: {},
  }
);

export default machine;
