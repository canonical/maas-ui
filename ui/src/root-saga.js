import { all } from "redux-saga/effects";

import { watchWebSockets } from "./app/base/sagas";

export default function* rootSaga() {
  yield all([watchWebSockets()]);
}
