import { all } from "redux-saga/effects";

import {
  watchWebSockets,
  watchFetchLicenseKeys,
  watchDeleteLicenseKey,
  watchFetchScripts,
  watchDeleteScript,
  watchUploadScript
} from "./app/base/sagas";

export default function* rootSaga() {
  yield all([
    watchWebSockets(),
    watchFetchLicenseKeys(),
    watchDeleteLicenseKey(),
    watchFetchScripts(),
    watchDeleteScript(),
    watchUploadScript()
  ]);
}
