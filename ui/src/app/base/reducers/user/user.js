import { createStandardReducer } from "app/utils/redux";

import { user as userActions } from "app/base/actions";

export const initialState = {
  auth: {},
  errors: {},
  items: [],
  loaded: false,
  loading: false,
  saved: false,
  saving: false,
};

const user = createStandardReducer(userActions, initialState);

export default user;
