import produce from "immer";

const machine = produce(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_MACHINE_START":
        draft.loading = true;
        break;
      case "FETCH_MACHINE_SUCCESS":
        draft.loading = false;
        draft.loaded = true;
        draft.items = action.payload;
        break;
      case "CREATE_MACHINE_START":
        draft.saved = false;
        draft.saving = true;
        break;
      case "CREATE_MACHINE_SUCCESS":
        draft.errors = {};
        draft.saved = true;
        draft.saving = false;
        break;
      case "FETCH_MACHINE_ERROR":
      case "CREATE_MACHINE_ERROR":
        draft.errors = action.error;
        draft.saving = false;
        break;
      case "CREATE_MACHINE_NOTIFY":
        draft.items.push(action.payload);
        break;
      case "UPDATE_MACHINE_NOTIFY":
        for (let i in draft.items) {
          if (draft.items[i].id === action.payload.id) {
            draft.items[i] = action.payload;
            break;
          }
        }
        draft.awaitingUpdate = false;
        break;
      case "CHECK_MACHINE_POWER_START":
        draft.awaitingUpdate = true;
        break;
      case "CHECK_MACHINE_POWER_ERROR":
        draft.awaitingUpdate = false;
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
      case "SET_MACHINE_POOL_ERROR":
      case "SET_MACHINE_ZONE_ERROR":
      case "TURN_MACHINE_OFF_ERROR":
      case "TURN_MACHINE_ON_ERROR":
        draft.errors = action.error;
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
    awaitingUpdate: false,
    errors: {},
    items: [],
    loaded: false,
    loading: false,
    saved: false,
    saving: false
  }
);

export default machine;
