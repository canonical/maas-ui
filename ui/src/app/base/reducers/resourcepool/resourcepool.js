import { createStandardReducer } from "app/utils/redux";

import { resourcepool as poolActions } from "app/base/actions";

const resourcepool = createStandardReducer(poolActions);

export default resourcepool;
