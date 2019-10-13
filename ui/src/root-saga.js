import { all } from "redux-saga/effects";

import {
  watchWebSockets,
  watchCreateLicenseKey,
  watchUpdateLicenseKey,
  watchDeleteLicenseKey,
  watchFetchLicenseKeys,
  watchDeleteScript,
  watchFetchScripts,
  watchUploadScript
} from "./app/base/sagas";

export default function* rootSaga() {
  yield all([
    watchWebSockets(),
    watchCreateLicenseKey(),
    watchUpdateLicenseKey(),
    watchDeleteLicenseKey(),
    watchFetchLicenseKeys(),
    watchDeleteScript(),
    watchFetchScripts(),
    watchUploadScript()
  ]);
}
