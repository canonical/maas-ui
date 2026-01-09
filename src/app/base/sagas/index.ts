import actionHandlers from "./actions";
import {
  watchCheckAuthenticated,
  watchLogin,
  watchLogout,
  watchExternalLogin,
  watchCreateLicenseKey,
  watchUpdateLicenseKey,
  watchDeleteLicenseKey,
  watchFetchLicenseKeys,
  watchUploadScript,
  watchAddMachineChassis,
  watchExtendSession,
} from "./http";
import { watchWebSockets } from "./websockets";

export {
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
  watchExtendSession,
};
