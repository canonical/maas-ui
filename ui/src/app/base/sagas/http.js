import { call, put, takeEvery, takeLatest } from "redux-saga/effects";

import getCookie from "./utils";

const SCRIPTS_API = `/MAAS/api/2.0/scripts/`;

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

export const api = {
  scripts: {
    fetch: csrftoken => {
      return fetch(`${SCRIPTS_API}?include_script=true`, {
        headers: { ...DEFAULT_HEADERS, "X-CSRFToken": csrftoken }
      })
        .then(handleErrors)
        .then(response => response.json());
    },
    delete: (csrftoken, name) => {
      return fetch(`${SCRIPTS_API}${name}`, {
        headers: { ...DEFAULT_HEADERS, "X-CSRFToken": csrftoken },
        method: "DELETE"
      }).then(handleErrors);
    },
    upload: (name, type, script, csrftoken) => {
      return fetch(`${SCRIPTS_API}`, {
        headers: { ...DEFAULT_HEADERS, "X-CSRFToken": csrftoken },
        method: "POST",
        body: JSON.stringify({ name, type, script })
      })
        .then(response => Promise.all([response.ok, response.json()]))
        .then(([responseOk, body]) => {
          if (!responseOk) {
            throw body;
          }
        });
    }
  }
};

export function* fetchScriptsSaga() {
  const csrftoken = yield call(getCookie, "csrftoken");
  let response;
  try {
    yield put({ type: `FETCH_SCRIPTS_START` });
    response = yield call(api.scripts.fetch, csrftoken);
    yield put({
      type: `FETCH_SCRIPTS_SUCCESS`,
      payload: response
    });
  } catch (error) {
    // fetch doesn't return a complex error object, so we coerce the status text.
    yield put({
      type: `FETCH_SCRIPTS_ERROR`,
      errors: { error: error.message }
    });
  }
}

export function* uploadScriptSaga(action) {
  const csrftoken = yield call(getCookie, "csrftoken");
  const { name, type, script } = action.payload;
  let response;
  try {
    yield put({ type: `UPLOAD_SCRIPT_START` });
    response = yield call(api.scripts.upload, name, type, script, csrftoken);
    console.log(response);
    yield put({
      type: `UPLOAD_SCRIPT_SUCCESS`,
      payload: response
    });
  } catch (errors) {
    yield put({
      type: `UPLOAD_SCRIPT_ERROR`,
      errors
    });
  }
}

export function* deleteScriptSaga(action) {
  const csrftoken = yield call(getCookie, "csrftoken");
  try {
    yield put({ type: `DELETE_SCRIPT_START` });
    yield call(api.scripts.delete, csrftoken, action.payload.name);
    yield put({
      type: `DELETE_SCRIPT_SUCCESS`,
      payload: action.payload.id
    });
  } catch (error) {
    // delete doesn't return a complex error object, so we coerce the status text.
    yield put({
      type: `DELETE_SCRIPT_ERROR`,
      errors: { error: error.message }
    });
  }
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
