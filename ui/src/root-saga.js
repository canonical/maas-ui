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
  watchUploadScript,
  watchAddMachineChassis,
} from "./app/base/sagas";

export default function* rootSaga(websocketClient) {
  yield all([
    watchCheckAuthenticated(),
    watchLogin(),
    watchLogout(),
    watchExternalLogin(),
    watchWebSockets(websocketClient, actionHandlers),
    watchCreateLicenseKey(),
    watchUpdateLicenseKey(),
    watchDeleteLicenseKey(),
    watchFetchLicenseKeys(),
    watchUploadScript(),
    watchAddMachineChassis(),
  ]);
}
