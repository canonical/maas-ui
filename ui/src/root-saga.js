import { all } from "redux-saga/effects";

import {
  watchCheckAuthenticated,
  watchLogin,
  watchLogout,
  watchExternalLogin,
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
    watchCheckAuthenticated(),
    watchLogin(),
    watchLogout(),
    watchExternalLogin(),
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
