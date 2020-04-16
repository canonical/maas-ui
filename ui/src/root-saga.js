import { all } from "redux-saga/effects";

import {
  actionHandlers,
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
  watchUploadScript,
  watchAddMachineChassis,
} from "./app/base/sagas";

export default function* rootSaga() {
  yield all([
    watchCheckAuthenticated(),
    watchLogin(),
    watchLogout(),
    watchExternalLogin(),
    watchWebSockets(actionHandlers),
    watchCreateLicenseKey(),
    watchUpdateLicenseKey(),
    watchDeleteLicenseKey(),
    watchFetchLicenseKeys(),
    watchDeleteScript(),
    watchFetchScripts(),
    watchUploadScript(),
    watchAddMachineChassis(),
  ]);
}
