import { call, put, takeEvery, takeLatest } from "redux-saga/effects";

import getCookie from "./utils";

const ROOT_API = "/MAAS/api/2.0/";
const SCRIPTS_API = `${ROOT_API}scripts/`;
const LICENSE_KEY_API = `${ROOT_API}license-key/`;
const LICENSE_KEYS_API = `${ROOT_API}license-keys/`;

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
  licenseKeys: {
    fetch: csrftoken => {
      return fetch(`${LICENSE_KEYS_API}`, {
        headers: { ...DEFAULT_HEADERS, "X-CSRFToken": csrftoken }
      })
        .then(handleErrors)
        .then(response => response.json());
    },
    delete: (osystem, distro_series, csrftoken) => {
      return fetch(`${LICENSE_KEY_API}${osystem}/${distro_series}`, {
        headers: { ...DEFAULT_HEADERS, "X-CSRFToken": csrftoken },
        method: "DELETE"
      }).then(handleErrors);
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

export function* watchFetchLicenseKeys() {
  yield takeLatest("FETCH_LICENSE_KEYS", fetchLicenseKeysSaga);
}

export function* watchDeleteLicenseKey() {
  yield takeEvery("DELETE_LICENSE_KEY", deleteLicenseKeySaga);
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
