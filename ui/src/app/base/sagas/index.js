import { watchWebSockets } from "./websockets";
import {
  watchCheckAuthenticated,
  watchLogin,
  watchLogout,
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
  watchWebSockets,
  watchCreateLicenseKey,
  watchUpdateLicenseKey,
  watchDeleteLicenseKey,
  watchFetchLicenseKeys,
  watchDeleteScript,
  watchFetchScripts,
  watchUploadScript
};
