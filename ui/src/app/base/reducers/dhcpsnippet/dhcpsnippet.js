import { createStandardReducer } from "app/utils/redux";

import { dhcpsnippet as dhcpSnippetActions } from "app/base/actions";

const dhcpsnippet = createStandardReducer(dhcpSnippetActions);

export default dhcpsnippet;
