import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import type { GeneralState, GenerateCertificateParams } from "./types";
import { GeneralMeta } from "./types";

const generateInitialState = <K extends keyof GeneralState>(
  initialData: GeneralState[K]["data"]
) => ({
  data: initialData,
  errors: null,
  loaded: false,
  loading: false,
});

const generatePrepareReducer = (method: string) => ({
  prepare: () => ({
    meta: {
      cache: true,
      model: GeneralMeta.MODEL,
      method,
    },
    payload: null,
  }),
  reducer: () => {
    // No state changes need to be handled for this action.
  },
});

const generateStartReducer =
  (key: keyof GeneralState) => (state: GeneralState) => {
    state[key].loading = true;
  };

const generateErrorReducer =
  (key: keyof GeneralState) =>
  (
    state: GeneralState,
    action: PayloadAction<GeneralState[typeof key]["errors"], string>
  ) => {
    state[key].errors = action.payload;
    state[key].loading = false;
  };

const generateSuccessReducer =
  (key: keyof GeneralState) =>
  (
    state: GeneralState,
    action: PayloadAction<GeneralState[typeof key]["data"]>
  ) => {
    state[key].data = action.payload;
    state[key].loaded = true;
    state[key].loading = false;
  };

const generalSlice = createSlice({
  name: GeneralMeta.MODEL,
  initialState: {
    architectures: generateInitialState([]),
    bondOptions: generateInitialState(null),
    componentsToDisable: generateInitialState([]),
    defaultMinHweKernel: generateInitialState(""),
    generatedCertificate: generateInitialState(null),
    hweKernels: generateInitialState([]),
    knownArchitectures: generateInitialState([]),
    machineActions: generateInitialState([]),
    osInfo: generateInitialState(null),
    pocketsToDisable: generateInitialState([]),
    powerTypes: generateInitialState([]),
    version: generateInitialState(""),
  } as GeneralState,
  reducers: {
    cleanupGeneratedCertificateErrors: (state) => {
      state.generatedCertificate.errors = null;
    },
    clearGeneratedCertificate: (state) => {
      state.generatedCertificate.data = null;
      state.generatedCertificate.errors = null;
      state.generatedCertificate.loaded = false;
      state.generatedCertificate.loading = false;
    },
    fetchArchitectures: generatePrepareReducer("architectures"),
    fetchArchitecturesStart: generateStartReducer("architectures"),
    fetchArchitecturesError: generateErrorReducer("architectures"),
    fetchArchitecturesSuccess: generateSuccessReducer("architectures"),
    fetchBondOptions: generatePrepareReducer("bond_options"),
    fetchBondOptionsStart: generateStartReducer("bondOptions"),
    fetchBondOptionsError: generateErrorReducer("bondOptions"),
    fetchBondOptionsSuccess: generateSuccessReducer("bondOptions"),
    fetchComponentsToDisable: generatePrepareReducer("components_to_disable"),
    fetchComponentsToDisableStart: generateStartReducer("componentsToDisable"),
    fetchComponentsToDisableError: generateErrorReducer("componentsToDisable"),
    fetchComponentsToDisableSuccess: generateSuccessReducer(
      "componentsToDisable"
    ),
    fetchDefaultMinHweKernel: generatePrepareReducer("default_min_hwe_kernel"),
    fetchDefaultMinHweKernelStart: generateStartReducer("defaultMinHweKernel"),
    fetchDefaultMinHweKernelError: generateErrorReducer("defaultMinHweKernel"),
    fetchDefaultMinHweKernelSuccess: generateSuccessReducer(
      "defaultMinHweKernel"
    ),
    fetchHweKernels: generatePrepareReducer("hwe_kernels"),
    fetchHweKernelsStart: generateStartReducer("hweKernels"),
    fetchHweKernelsError: generateErrorReducer("hweKernels"),
    fetchHweKernelsSuccess: generateSuccessReducer("hweKernels"),
    fetchKnownArchitectures: generatePrepareReducer("known_architectures"),
    fetchKnownArchitecturesStart: generateStartReducer("knownArchitectures"),
    fetchKnownArchitecturesError: generateErrorReducer("knownArchitectures"),
    fetchKnownArchitecturesSuccess:
      generateSuccessReducer("knownArchitectures"),
    fetchMachineActions: generatePrepareReducer("machine_actions"),
    fetchMachineActionsStart: generateStartReducer("machineActions"),
    fetchMachineActionsError: generateErrorReducer("machineActions"),
    fetchMachineActionsSuccess: generateSuccessReducer("machineActions"),
    fetchOsInfo: generatePrepareReducer("osinfo"),
    fetchOsInfoStart: generateStartReducer("osInfo"),
    fetchOsInfoError: generateErrorReducer("osInfo"),
    fetchOsInfoSuccess: generateSuccessReducer("osInfo"),
    fetchPocketsToDisable: generatePrepareReducer("pockets_to_disable"),
    fetchPocketsToDisableStart: generateStartReducer("pocketsToDisable"),
    fetchPocketsToDisableError: generateErrorReducer("pocketsToDisable"),
    fetchPocketsToDisableSuccess: generateSuccessReducer("pocketsToDisable"),
    fetchPowerTypes: generatePrepareReducer("power_types"),
    fetchPowerTypesStart: generateStartReducer("powerTypes"),
    fetchPowerTypesError: generateErrorReducer("powerTypes"),
    fetchPowerTypesSuccess: generateSuccessReducer("powerTypes"),
    fetchVersion: generatePrepareReducer("version"),
    fetchVersionStart: generateStartReducer("version"),
    fetchVersionError: generateErrorReducer("version"),
    fetchVersionSuccess: generateSuccessReducer("version"),
    generateCertificate: {
      prepare: (params: GenerateCertificateParams) => ({
        meta: {
          model: GeneralMeta.MODEL,
          method: "generate_client_certificate",
        },
        payload: {
          params,
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    generateCertificateStart: generateStartReducer("generatedCertificate"),
    generateCertificateError: generateErrorReducer("generatedCertificate"),
    generateCertificateSuccess: generateSuccessReducer("generatedCertificate"),
  },
});

export const { actions } = generalSlice;

export default generalSlice.reducer;
