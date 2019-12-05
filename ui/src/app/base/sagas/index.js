import { watchWebSockets } from "./websockets";
import {
  watchCheckAuthenticated,
  watchLogin,
  watchLogout,
  watchExternalLogin,
  watchCreateLicenseKey,
  watchUpdateLicenseKey,
  watchDeleteLicenseKey,
  watchFetchLicenseKeys,
  watchDeleteScript,
  watchFetchScripts,
  watchUploadScript
} from "./http";

export {
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
};
