import { createStandardReducer } from "app/utils/redux";

import { subnet as subnetActions } from "app/base/actions";

const subnet = createStandardReducer(subnetActions);

export default subnet;
