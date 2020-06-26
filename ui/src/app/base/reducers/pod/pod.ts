import { createStandardReducer } from "app/utils/redux";

import { pod as podActions } from "app/base/actions";
import { Pod, PodState, TSFixMe } from "app/base/types";

type RefreshPodErrorAction = {
  type: "REFRESH_POD_ERROR";
  error: TSFixMe;
};

type RefreshPodSuccessAction = {
  type: "REFRESH_POD_SUCCESS";
  payload: Pod;
};

type SelectPodAction = {
  type: "SET_SELECTED_PODS";
  payload: Pod["id"][];
};

const initialState = {
  errors: {},
  items: [],
  loaded: false,
  loading: false,
  saved: false,
  saving: false,
  selected: [],
};

const pod = createStandardReducer(podActions, initialState, {
  REFRESH_POD_ERROR: (state: PodState, action: RefreshPodErrorAction) => {
    state.errors = action.error;
    state.saving = false;
    state.saved = false;
  },
  REFRESH_POD_SUCCESS: (state: PodState, action: RefreshPodSuccessAction) => {
    for (const i in state.items) {
      if (state.items[i].id === action.payload.id) {
        state.items[i] = action.payload;
        break;
      }
    }
  },
  SET_SELECTED_PODS: (state: PodState, action: SelectPodAction) => {
    state.selected = action.payload;
  },
});

export default pod;
