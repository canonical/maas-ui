import { all } from "redux-saga/effects";

import {
  watchWebSockets,
  watchFetchScripts,
  watchDeleteScript,
  watchUploadScript
} from "./app/base/sagas";

export default function* rootSaga() {
  yield all([
    watchWebSockets(),
    watchFetchScripts(),
    watchDeleteScript(),
    watchUploadScript()
  ]);
}
