import { createStandardReducer } from "app/utils/redux";

import { service as serviceActions } from "app/base/actions";

const service = createStandardReducer(serviceActions);

export default service;
