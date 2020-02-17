import { createStandardReducer } from "app/utils/redux";

import { tag as tagActions } from "app/base/actions";

const tag = createStandardReducer(tagActions);

export default tag;
