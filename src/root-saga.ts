import { all } from "typed-redux-saga/macro";
import type { SagaGenerator } from "typed-redux-saga/macro";

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

import type { MessageHandler } from "app/base/sagas/actions";
import { watchQueryCache } from "app/base/sagas/websockets/handlers/queryCache";
import type WebSocketClient from "websocket-client";

export default function* rootSaga(
  websocketClient: WebSocketClient
): SagaGenerator<void> {
  yield* all([
    watchCheckAuthenticated(),
    watchLogin(),
    watchLogout(),
    watchExternalLogin(),
    watchWebSockets(websocketClient, actionHandlers as MessageHandler[]),
    watchQueryCache(),
    watchCreateLicenseKey(),
    watchUpdateLicenseKey(),
    watchDeleteLicenseKey(),
    watchFetchLicenseKeys(),
    watchUploadScript(),
    watchAddMachineChassis(),
  ]);
}
