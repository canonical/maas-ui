import { createStandardReducer } from "app/utils/redux";

import { vlan as vlanActions } from "app/base/actions";

const vlan = createStandardReducer(vlanActions);

export default vlan;
