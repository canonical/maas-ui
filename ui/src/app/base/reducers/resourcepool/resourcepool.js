import { createStandardReducer } from "app/utils/redux";

import { resourcepool as poolActions } from "app/base/actions";

const resourcepool = createStandardReducer(poolActions, undefined, {
  CREATE_RESOURCEPOOL_WITH_MACHINES: (state) => {
    state.errors = {};
  },
});

export default resourcepool;
