import { createStandardReducer } from "app/utils/redux";

import { controller as controllerActions } from "app/base/actions";

const controller = createStandardReducer(controllerActions);

export default controller;
