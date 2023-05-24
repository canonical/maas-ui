import type {
  CaseReducer,
  PayloadAction,
  PrepareAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import type { GeneralState } from "app/store/general/types";
import { capitaliseFirst } from "app/utils";

const generateInitialState = <K extends keyof GeneralState>(
  initialData: GeneralState[K]["data"]
) => ({
  data: initialData,
  errors: {},
  loaded: false,
  loading: false,
});

type WithPrepare = {
  reducer: CaseReducer<GeneralState>;
  prepare: PrepareAction<void>;
};

// Override the types for actions that don't take a payload.
type Reducers = SliceCaseReducers<GeneralState> & {
  fetchArchitectures: WithPrepare;
  fetchBondOptions: WithPrepare;
  fetchComponentsToDisable: WithPrepare;
  fetchDefaultMinHweKernel: WithPrepare;
  fetchHweKernels: WithPrepare;
  fetchKnownArchitectures: WithPrepare;
  fetchMachineActions: WithPrepare;
  fetchNavigationOptions: WithPrepare;
  fetchOsInfo: WithPrepare;
  fetchPocketsToDisable: WithPrepare;
  fetchPowerTypes: WithPrepare;
  fetchVersion: WithPrepare;
};

const generateGeneralReducers = <K extends keyof GeneralState>(
  key: K,
  method: string
) => ({
  [`fetch${capitaliseFirst(key)}`]: {
    prepare: () => ({
      meta: {
        cache: true,
        model: "general",
        method,
      },
      payload: null,
    }),
    reducer: () => {
      // No state changes need to be handled for this action.
    },
  },
  [`fetch${capitaliseFirst(key)}Start`]: (state: GeneralState) => {
    state[key].loading = true;
  },
  [`fetch${capitaliseFirst(key)}Error`]: (
    state: GeneralState,
    action: PayloadAction<GeneralState[K]["errors"], string>
  ) => {
    state[key].errors = action.payload;
    state[key].loading = false;
  },
  [`fetch${capitaliseFirst(key)}Success`]: (
    state: GeneralState,
    action: PayloadAction<GeneralState[K]["data"]>
  ) => {
    state[key].loading = false;
    state[key].loaded = true;
    state[key].data = action.payload;
  },
});

const generalSlice = createSlice({
  name: "general",
  initialState: {
    architectures: generateInitialState([]),
    bondOptions: generateInitialState(null),
    componentsToDisable: generateInitialState([]),
    defaultMinHweKernel: generateInitialState(""),
    hweKernels: generateInitialState([]),
    knownArchitectures: generateInitialState([]),
    machineActions: generateInitialState([]),
    navigationOptions: generateInitialState(null),
    osInfo: generateInitialState(null),
    pocketsToDisable: generateInitialState([]),
    powerTypes: generateInitialState([]),
    version: generateInitialState(""),
  },
  reducers: {
    ...generateGeneralReducers("architectures", "architectures"),
    ...generateGeneralReducers("bondOptions", "bond_options"),
    ...generateGeneralReducers("componentsToDisable", "components_to_disable"),
    ...generateGeneralReducers("defaultMinHweKernel", "default_min_hwe_kernel"),
    ...generateGeneralReducers("hweKernels", "hwe_kernels"),
    ...generateGeneralReducers("knownArchitectures", "known_architectures"),
    ...generateGeneralReducers("machineActions", "machine_actions"),
    ...generateGeneralReducers("navigationOptions", "navigation_options"),
    ...generateGeneralReducers("osInfo", "osinfo"),
    ...generateGeneralReducers("pocketsToDisable", "pockets_to_disable"),
    ...generateGeneralReducers("powerTypes", "power_types"),
    ...generateGeneralReducers("version", "version"),
  } as Reducers,
});

export const { actions } = generalSlice;

export default generalSlice.reducer;
