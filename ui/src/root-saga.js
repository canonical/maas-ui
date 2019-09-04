import { all } from "redux-saga/effects";

import { watchWebSockets, watchFetchScripts } from "./app/base/sagas";

export default function* rootSaga() {
  yield all([watchWebSockets(), watchFetchScripts()]);
}
