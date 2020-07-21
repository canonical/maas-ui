import { createStandardReducer } from "app/utils/redux";

import { fabric as fabricActions } from "app/base/actions";

const fabric = createStandardReducer(fabricActions);

export default fabric;
