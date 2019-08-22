import produce from "immer";

const general = produce(
  (draft, action) => {
    switch (action.type) {
      case "FETCH_GENERAL_COMPONENTS_TO_DISABLE_START":
      case "FETCH_GENERAL_KNOWN_ARCHITECTURES_START":
      case "FETCH_GENERAL_OSINFO_START":
      case "FETCH_GENERAL_POCKETS_TO_DISABLE_START":
        draft.loading = true;
        break;
      case "FETCH_GENERAL_COMPONENTS_TO_DISABLE_ERROR":
      case "FETCH_GENERAL_KNOWN_ARCHITECTURES_ERROR":
      case "FETCH_GENERAL_OSINFO_ERROR":
      case "FETCH_GENERAL_POCKETS_TO_DISABLE_ERROR":
        draft.errors = action.error;
        draft.loading = false;
        break;
      case "FETCH_GENERAL_COMPONENTS_TO_DISABLE_SUCCESS":
        draft.loading = false;
        draft.loaded = true;
        draft.componentsToDisable = action.payload;
        break;
      case "FETCH_GENERAL_KNOWN_ARCHITECTURES_SUCCESS":
        draft.loading = false;
        draft.loaded = true;
        draft.knownArchitectures = action.payload;
        break;
      case "FETCH_GENERAL_OSINFO_SUCCESS":
        draft.loading = false;
        draft.loaded = true;
        draft.osInfo = action.payload;
        break;
      case "FETCH_GENERAL_POCKETS_TO_DISABLE_SUCCESS":
        draft.loading = false;
        draft.loaded = true;
        draft.pocketsToDisable = action.payload;
        break;
      default:
        return draft;
    }
  },
  {
    loading: false,
    loaded: false,
    componentsToDisable: [],
    knownArchitectures: [],
    osInfo: {},
    pocketsToDisable: []
  }
);

export default general;
