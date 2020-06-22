import { createStandardReducer } from "app/utils/redux";

import { pod as podActions } from "app/base/actions";
import { PodState, SelectPodAction } from "app/base/types";

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
  SET_SELECTED_PODS: (state: PodState, action: SelectPodAction) => {
    state.selected = action.payload;
  },
});

export default pod;
