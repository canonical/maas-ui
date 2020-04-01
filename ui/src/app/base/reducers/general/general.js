import { combineReducers } from "redux";
import produce from "immer";

export const generateGeneralReducer = (name, initialData) =>
  produce(
    (draft, action) => {
      switch (action.type) {
        case `FETCH_GENERAL_${name}_START`:
          draft.loading = true;
          break;
        case `FETCH_GENERAL_${name}_ERROR`:
          draft.errors = action.error;
          draft.loading = false;
          break;
        case `FETCH_GENERAL_${name}_SUCCESS`:
          draft.loading = false;
          draft.loaded = true;
          draft.data = action.payload;
          break;
        default:
          return draft;
      }
    },
    {
      data: initialData,
      errors: {},
      loaded: false,
      loading: false,
    }
  );

const architectures = generateGeneralReducer("ARCHITECTURES", []);
const componentsToDisable = generateGeneralReducer("COMPONENTS_TO_DISABLE", []);
const defaultMinHweKernel = generateGeneralReducer(
  "DEFAULT_MIN_HWE_KERNEL",
  ""
);
const hweKernels = generateGeneralReducer("HWE_KERNELS", []);
const knownArchitectures = generateGeneralReducer("KNOWN_ARCHITECTURES", []);
const machineActions = generateGeneralReducer("MACHINE_ACTIONS", []);
const navigationOptions = generateGeneralReducer("NAVIGATION_OPTIONS", {});
const osInfo = generateGeneralReducer("OSINFO", {});
const pocketsToDisable = generateGeneralReducer("POCKETS_TO_DISABLE", []);
const powerTypes = generateGeneralReducer("POWER_TYPES", []);
const version = generateGeneralReducer("VERSION", "");

export const general = combineReducers({
  architectures,
  componentsToDisable,
  defaultMinHweKernel,
  hweKernels,
  knownArchitectures,
  machineActions,
  navigationOptions,
  osInfo,
  pocketsToDisable,
  powerTypes,
  version,
});

export default general;
