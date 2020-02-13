import { createStandardReducer } from "app/utils/redux";

import { domain as domainActions } from "app/base/actions";

const domain = createStandardReducer(domainActions);

export default domain;
