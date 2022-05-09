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
      method,
      model: GeneralMeta.MODEL,
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
  initialState: {
    architectures: generateInitialState([]),
    bondOptions: generateInitialState(null),
    componentsToDisable: generateInitialState([]),
    defaultMinHweKernel: generateInitialState(""),
    generatedCertificate: generateInitialState(null),
    hweKernels: generateInitialState([]),
    knownArchitectures: generateInitialState([]),
    knownBootArchitectures: generateInitialState([]),
    machineActions: generateInitialState([]),
    osInfo: generateInitialState(null),
    pocketsToDisable: generateInitialState([]),
    powerTypes: generateInitialState([]),
    tlsCertificate: generateInitialState(null),
    version: generateInitialState(""),
  } as GeneralState,
  name: GeneralMeta.MODEL,
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
    fetchArchitecturesError: generateErrorReducer("architectures"),
    fetchArchitecturesStart: generateStartReducer("architectures"),
    fetchArchitecturesSuccess: generateSuccessReducer("architectures"),
    fetchBondOptions: generatePrepareReducer("bond_options"),
    fetchBondOptionsError: generateErrorReducer("bondOptions"),
    fetchBondOptionsStart: generateStartReducer("bondOptions"),
    fetchBondOptionsSuccess: generateSuccessReducer("bondOptions"),
    fetchComponentsToDisable: generatePrepareReducer("components_to_disable"),
    fetchComponentsToDisableError: generateErrorReducer("componentsToDisable"),
    fetchComponentsToDisableStart: generateStartReducer("componentsToDisable"),
    fetchComponentsToDisableSuccess: generateSuccessReducer(
      "componentsToDisable"
    ),
    fetchDefaultMinHweKernel: generatePrepareReducer("default_min_hwe_kernel"),
    fetchDefaultMinHweKernelError: generateErrorReducer("defaultMinHweKernel"),
    fetchDefaultMinHweKernelStart: generateStartReducer("defaultMinHweKernel"),
    fetchDefaultMinHweKernelSuccess: generateSuccessReducer(
      "defaultMinHweKernel"
    ),
    fetchHweKernels: generatePrepareReducer("hwe_kernels"),
    fetchHweKernelsError: generateErrorReducer("hweKernels"),
    fetchHweKernelsStart: generateStartReducer("hweKernels"),
    fetchHweKernelsSuccess: generateSuccessReducer("hweKernels"),
    fetchKnownArchitectures: generatePrepareReducer("known_architectures"),
    fetchKnownArchitecturesError: generateErrorReducer("knownArchitectures"),
    fetchKnownArchitecturesStart: generateStartReducer("knownArchitectures"),
    fetchKnownArchitecturesSuccess:
      generateSuccessReducer("knownArchitectures"),
    fetchKnownBootArchitectures: generatePrepareReducer(
      "known_boot_architectures"
    ),
    fetchKnownBootArchitecturesError: generateErrorReducer(
      "knownBootArchitectures"
    ),
    fetchKnownBootArchitecturesStart: generateStartReducer(
      "knownBootArchitectures"
    ),
    fetchKnownBootArchitecturesSuccess: generateSuccessReducer(
      "knownBootArchitectures"
    ),
    fetchMachineActions: generatePrepareReducer("machine_actions"),
    fetchMachineActionsError: generateErrorReducer("machineActions"),
    fetchMachineActionsStart: generateStartReducer("machineActions"),
    fetchMachineActionsSuccess: generateSuccessReducer("machineActions"),
    fetchOsInfo: generatePrepareReducer("osinfo"),
    fetchOsInfoError: generateErrorReducer("osInfo"),
    fetchOsInfoStart: generateStartReducer("osInfo"),
    fetchOsInfoSuccess: generateSuccessReducer("osInfo"),
    fetchPocketsToDisable: generatePrepareReducer("pockets_to_disable"),
    fetchPocketsToDisableError: generateErrorReducer("pocketsToDisable"),
    fetchPocketsToDisableStart: generateStartReducer("pocketsToDisable"),
    fetchPocketsToDisableSuccess: generateSuccessReducer("pocketsToDisable"),
    fetchPowerTypes: generatePrepareReducer("power_types"),
    fetchPowerTypesError: generateErrorReducer("powerTypes"),
    fetchPowerTypesStart: generateStartReducer("powerTypes"),
    fetchPowerTypesSuccess: generateSuccessReducer("powerTypes"),
    fetchTlsCertificate: generatePrepareReducer("tls_certificate"),
    fetchTlsCertificateError: generateErrorReducer("tlsCertificate"),
    fetchTlsCertificateStart: generateStartReducer("tlsCertificate"),
    fetchTlsCertificateSuccess: generateSuccessReducer("tlsCertificate"),
    fetchVersion: generatePrepareReducer("version"),
    fetchVersionError: generateErrorReducer("version"),
    fetchVersionStart: generateStartReducer("version"),
    fetchVersionSuccess: generateSuccessReducer("version"),
    generateCertificate: {
      prepare: (params: GenerateCertificateParams) => ({
        meta: {
          method: "generate_client_certificate",
          model: GeneralMeta.MODEL,
        },
        payload: {
          params,
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    generateCertificateError: generateErrorReducer("generatedCertificate"),
    generateCertificateStart: generateStartReducer("generatedCertificate"),
    generateCertificateSuccess: generateSuccessReducer("generatedCertificate"),
  },
});

export const { actions } = generalSlice;

export default generalSlice.reducer;
