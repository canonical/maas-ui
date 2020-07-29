import { createStandardReducer } from "app/utils/redux";

import { space as spaceActions } from "app/base/actions";

const space = createStandardReducer(spaceActions);

export default space;
