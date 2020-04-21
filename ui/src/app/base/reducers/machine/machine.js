import { createNextState } from "@reduxjs/toolkit";

const machine = createNextState(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_MACHINE_START":
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
            draft.statuses[newItem.system_id] = {
              savingPool: false,
            };
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
      case "CREATE_MACHINE_ERROR":
        draft.errors = action.error;
        draft.saving = false;
        break;
      case "CREATE_MACHINE_NOTIFY":
        draft.items.push(action.payload);
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
      case "SET_MACHINE_POOL_START":
        draft.statuses[action.meta.item.system_id].savingPool = true;
        break;
      case "SET_MACHINE_POOL_SUCCESS":
        draft.statuses[action.meta.item.system_id].savingPool = false;
        break;
      case "SET_MACHINE_POOL_ERROR":
        draft.statuses[action.meta.item.system_id].savingPool = false;
        draft.errors = action.error;
        break;
      case "ACQUIRE_MACHINE_ERROR":
      case "RELEASE_MACHINE_ERROR":
      case "COMMISSION_MACHINE_ERROR":
      case "DEPLOY_MACHINE_ERROR":
      case "ABORT_MACHINE_ERROR":
      case "TEST_MACHINE_ERROR":
      case "MACHINE_RESCUE_MODE_ERROR":
      case "MACHINE_EXIT_RESCUE_MODE_ERROR":
      case "MARK_MACHINE_BROKEN_ERROR":
      case "MARK_MACHINE_FIXED_ERROR":
      case "MACHINE_OVERRIDE_FAILED_TESTING_ERROR":
      case "LOCK_MACHINE_ERROR":
      case "UNLOCK_MACHINE_ERROR":
      case "TAG_MACHINE_ERROR":
      case "SET_MACHINE_ZONE_ERROR":
      case "TURN_MACHINE_OFF_ERROR":
      case "TURN_MACHINE_ON_ERROR":
      case "CHECK_MACHINE_POWER_ERROR":
        draft.errors = action.error;
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
