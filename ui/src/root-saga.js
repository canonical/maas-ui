import { all } from "redux-saga/effects";

import {
  watchWebSockets,
  watchFetchLicenseKeys,
  watchFetchScripts,
  watchDeleteScript,
  watchUploadScript
} from "./app/base/sagas";

export default function* rootSaga() {
  yield all([
    watchWebSockets(),
    watchFetchLicenseKeys(),
    watchFetchScripts(),
    watchDeleteScript(),
    watchUploadScript()
  ]);
}
