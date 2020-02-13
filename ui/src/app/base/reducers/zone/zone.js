import { createStandardReducer } from "app/utils/redux";

import { zone as zoneActions } from "app/base/actions";

const zone = createStandardReducer(zoneActions);

export default zone;
