import { call, put, takeEvery, takeLatest } from "redux-saga/effects";

import getCookie from "./utils";

const ROOT_API = "/MAAS/api/2.0/";
const SCRIPTS_API = `${ROOT_API}scripts/`;
const LICENSE_KEY_API = `${ROOT_API}license-key/`;
const LICENSE_KEYS_API = `${ROOT_API}license-keys/`;
const LOGIN_API = "/MAAS/accounts/login/";
const LOGOUT_API = "/MAAS/accounts/logout/";
const WHOAMI_API = `${ROOT_API}users/?op=whoami`;

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json"
};

const handleErrors = response => {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
};

const handlePromise = response => {
  if (response.headers) {
    const contentType = response.headers.get("Content-Type");
    if (contentType.includes("application/json")) {
      return Promise.all([response.ok, response.json()]);
    } else {
      return Promise.all([response.ok, response.text()]);
    }
  }
};

export const api = {
  auth: {
    checkAuthenticated: () => {
      return fetch(WHOAMI_API).then(handleErrors);
    },
    login: credentials => {
      return fetch(LOGIN_API, {
        method: "POST",
        mode: "no-cors",
        credentials: "include",
        headers: new Headers({
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest"
        }),
        body: Object.keys(credentials)
          .map(key => key + "=" + credentials[key])
          .join("&")
      })
        .then(handlePromise)
        .then(([responseOk, body]) => {
          if (!responseOk) {
            throw body;
          }
        });
    },
    logout: csrftoken => {
      return fetch(LOGOUT_API, {
        headers: { "X-CSRFToken": csrftoken },
        method: "POST"
      }).then(handleErrors);
    }
  },
  licenseKeys: {
    create: (key, csrftoken) => {
      const { osystem, distro_series, license_key } = key;
      return fetch(`${LICENSE_KEYS_API}`, {
        headers: { ...DEFAULT_HEADERS, "X-CSRFToken": csrftoken },
        method: "POST",
        body: JSON.stringify({ osystem, distro_series, license_key })
      })
        .then(handlePromise)
        .then(([responseOk, body]) => {
          if (!responseOk) {
            throw body;
          }
        });
    },
    update: (key, csrftoken) => {
      const { osystem, distro_series, license_key } = key;
      return fetch(`${LICENSE_KEY_API}${osystem}/${distro_series}`, {
        headers: { ...DEFAULT_HEADERS, "X-CSRFToken": csrftoken },
        method: "PUT",
        body: JSON.stringify({ license_key })
      })
        .then(handlePromise)
        .then(([responseOk, body]) => {
          if (!responseOk) {
            throw body;
          }
          return body;
        });
    },
    delete: (osystem, distro_series, csrftoken) => {
      return fetch(`${LICENSE_KEY_API}${osystem}/${distro_series}`, {
        headers: { ...DEFAULT_HEADERS, "X-CSRFToken": csrftoken },
        method: "DELETE"
      }).then(handleErrors);
    },
    fetch: csrftoken => {
      return fetch(`${LICENSE_KEYS_API}`, {
        headers: { ...DEFAULT_HEADERS, "X-CSRFToken": csrftoken }
      })
        .then(handleErrors)
        .then(response => response.json());
    }
  },
  scripts: {
    fetch: csrftoken => {
      return fetch(`${SCRIPTS_API}?include_script=true`, {
        headers: { ...DEFAULT_HEADERS, "X-CSRFToken": csrftoken }
      })
        .then(handleErrors)
        .then(response => response.json());
    },
    delete: (name, csrftoken) => {
      return fetch(`${SCRIPTS_API}${name}`, {
        headers: { ...DEFAULT_HEADERS, "X-CSRFToken": csrftoken },
        method: "DELETE"
      }).then(handleErrors);
    },
    upload: (script, csrftoken) => {
      const { name, type, contents } = script;
      return fetch(`${SCRIPTS_API}`, {
        headers: { ...DEFAULT_HEADERS, "X-CSRFToken": csrftoken },
        method: "POST",
        body: JSON.stringify({ name, type, script: contents })
      })
        .then(handlePromise)
        .then(([responseOk, body]) => {
          if (!responseOk) {
            throw body;
          }
        });
    }
  }
};

export function* checkAuthenticatedSaga(action) {
  try {
    yield put({ type: "CHECK_AUTHENTICATED_START" });
    yield call(api.auth.checkAuthenticated);
    yield put({
      type: "CHECK_AUTHENTICATED_SUCCESS"
    });
  } catch (error) {
    yield put({
      type: "CHECK_AUTHENTICATED_ERROR",
      errors: { error: error.message }
    });
  }
}

export function* loginSaga(action) {
  try {
    yield put({ type: "LOGIN_START" });
    yield call(api.auth.login, action.payload);
    yield put({
      type: "LOGIN_SUCCESS"
    });
  } catch (error) {
    yield put({
      type: "LOGIN_ERROR",
      error
    });
  }
}

export function* logoutSaga(action) {
  const csrftoken = yield call(getCookie, "csrftoken");
  try {
    yield put({ type: "LOGOUT_START" });
    yield call(api.auth.logout, csrftoken);
    yield put({
      type: "LOGOUT_SUCCESS"
    });
    yield put({
      type: "WEBSOCKET_DISCONNECT"
    });
  } catch (error) {
    yield put({
      type: "LOGOUT_ERROR",
      errors: { error: error.message }
    });
  }
}

export function* fetchLicenseKeysSaga() {
  const csrftoken = yield call(getCookie, "csrftoken");
  let response;
  try {
    yield put({ type: "FETCH_LICENSE_KEYS_START" });
    response = yield call(api.licenseKeys.fetch, csrftoken);
    yield put({
      type: "FETCH_LICENSE_KEYS_SUCCESS",
      payload: response
    });
  } catch (error) {
    yield put({
      type: "FETCH_LICENSE_KEYS_ERROR",
      errors: { error: error.message }
    });
  }
}

export function* deleteLicenseKeySaga(action) {
  const csrftoken = yield call(getCookie, "csrftoken");
  try {
    yield put({ type: "DELETE_LICENSE_KEY_START" });
    yield call(
      api.licenseKeys.delete,
      action.payload.osystem,
      action.payload.distro_series,
      csrftoken
    );
    yield put({
      type: "DELETE_LICENSE_KEY_SUCCESS",
      payload: action.payload
    });
  } catch (error) {
    yield put({
      type: "DELETE_LICENSE_KEY_ERROR",
      errors: { error: error.message }
    });
  }
}

export function* createLicenseKeySaga(action) {
  const csrftoken = yield call(getCookie, "csrftoken");
  const key = action.payload;
  let response;
  try {
    yield put({ type: "CREATE_LICENSE_KEY_START" });
    response = yield call(api.licenseKeys.create, key, csrftoken);
    yield put({
      type: "CREATE_LICENSE_KEY_SUCCESS",
      payload: response
    });
  } catch (errors) {
    let error = errors;
    if (typeof error === "string") {
      error = { "Create error": error };
    }
    yield put({
      type: "CREATE_LICENSE_KEY_ERROR",
      errors: error
    });
  }
}

export function* updateLicenseKeySaga(action) {
  const csrftoken = yield call(getCookie, "csrftoken");
  const key = action.payload;
  let response;
  try {
    yield put({ type: "UPDATE_LICENSE_KEY_START" });
    response = yield call(api.licenseKeys.update, key, csrftoken);
    yield put({
      type: "UPDATE_LICENSE_KEY_SUCCESS",
      payload: response
    });
  } catch (errors) {
    let error = errors;
    if (typeof error === "string") {
      error = { "Create error": error };
    }
    yield put({
      type: "UPDATE_LICENSE_KEY_ERROR",
      errors: error
    });
  }
}

export function* fetchScriptsSaga() {
  const csrftoken = yield call(getCookie, "csrftoken");
  let response;
  try {
    yield put({ type: "FETCH_SCRIPTS_START" });
    response = yield call(api.scripts.fetch, csrftoken);
    yield put({
      type: "FETCH_SCRIPTS_SUCCESS",
      payload: response
    });
  } catch (error) {
    // fetch doesn't return a complex error object, so we coerce the status text.
    yield put({
      type: "FETCH_SCRIPTS_ERROR",
      errors: { error: error.message }
    });
  }
}

export function* uploadScriptSaga(action) {
  const csrftoken = yield call(getCookie, "csrftoken");
  const script = action.payload;
  let response;
  try {
    yield put({ type: "UPLOAD_SCRIPT_START" });
    response = yield call(api.scripts.upload, script, csrftoken);
    yield put({
      type: "UPLOAD_SCRIPT_SUCCESS",
      payload: response
    });
  } catch (errors) {
    let error = errors;
    if (typeof error === "string") {
      error = { "Upload error": error };
    }
    yield put({
      type: "UPLOAD_SCRIPT_ERROR",
      errors: error
    });
  }
}

export function* deleteScriptSaga(action) {
  const csrftoken = yield call(getCookie, "csrftoken");
  try {
    yield put({ type: "DELETE_SCRIPT_START" });
    yield call(api.scripts.delete, action.payload.name, csrftoken);
    yield put({
      type: "DELETE_SCRIPT_SUCCESS",
      payload: action.payload.id
    });
  } catch (error) {
    // delete doesn't return a complex error object, so we coerce the status text.
    yield put({
      type: "DELETE_SCRIPT_ERROR",
      errors: { error: error.message }
    });
  }
}

export function* watchLogin() {
  yield takeLatest("LOGIN", loginSaga);
}

export function* watchLogout() {
  yield takeLatest("LOGOUT", logoutSaga);
}

export function* watchCheckAuthenticated() {
  yield takeLatest("CHECK_AUTHENTICATED", checkAuthenticatedSaga);
}

export function* watchCreateLicenseKey() {
  yield takeLatest("CREATE_LICENSE_KEY", createLicenseKeySaga);
}

export function* watchUpdateLicenseKey() {
  yield takeLatest("UPDATE_LICENSE_KEY", updateLicenseKeySaga);
}

export function* watchDeleteLicenseKey() {
  yield takeEvery("DELETE_LICENSE_KEY", deleteLicenseKeySaga);
}

export function* watchFetchLicenseKeys() {
  yield takeLatest("FETCH_LICENSE_KEYS", fetchLicenseKeysSaga);
}

export function* watchFetchScripts() {
  yield takeLatest("FETCH_SCRIPTS", fetchScriptsSaga);
}

export function* watchUploadScript() {
  yield takeEvery("UPLOAD_SCRIPT", uploadScriptSaga);
}

export function* watchDeleteScript() {
  yield takeEvery("DELETE_SCRIPT", deleteScriptSaga);
}
