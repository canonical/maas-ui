import { createStandardReducer } from "app/utils/redux";

import { device as deviceActions } from "app/base/actions";

const device = createStandardReducer(deviceActions);

export default device;
