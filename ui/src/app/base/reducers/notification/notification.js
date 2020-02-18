import { createStandardReducer } from "app/utils/redux";

import { notification as notificationActions } from "app/base/actions";

const notification = createStandardReducer(notificationActions);

export default notification;
