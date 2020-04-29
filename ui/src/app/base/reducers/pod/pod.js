import { createStandardReducer } from "app/utils/redux";

import { pod as podActions } from "app/base/actions";

const pod = createStandardReducer(podActions);

export default pod;
