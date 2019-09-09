import { call, put, takeLatest } from "redux-saga/effects";

import getCookie from "./utils";

const SCRIPTS_API = `/MAAS/api/2.0/scripts/`;

export const api = {
  scripts: {
    fetch: csrftoken => {
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-CSRFToken": csrftoken
      };
      return fetch(SCRIPTS_API, { headers }).then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      });
    },
    upload: (name, description, type, contents, csrftoken) => {
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-CSRFToken": csrftoken
      };
      return fetch(SCRIPTS_API, {
        headers,
        method: "PUT"
      }).then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      });
    }
  }
};

export function* fetchScriptsSaga() {
  const csrftoken = yield call(getCookie, "csrftoken");
  let response;
  try {
    yield put({ type: `FETCH_SCRIPTS_START` });
    response = yield call(api.scripts.fetchfetchScripts, csrftoken);
    yield put({
      type: `FETCH_SCRIPTS_SUCCESS`,
      payload: response
    });
  } catch (error) {
    yield put({
      type: `FETCH_SCRIPTS_ERROR`,
      error: error.message
    });
  }
}

export function* uploadScriptSaga(action) {
  const csrftoken = yield call(getCookie, "csrftoken");
  const { name, description, type, contents } = action.payload;
  let response;
  try {
    yield put({ type: `UPLOAD_SCRIPT_START` });
    response = yield call(
      api.scripts.upload,
      name,
      description,
      type,
      contents,
      csrftoken
    );
    yield put({
      type: `UPLOAD_SCRIPTS_SUCCESS`,
      payload: response
    });
  } catch (error) {
    yield put({
      type: `UPLOAD_SCRIPTS_ERROR`,
      error: error.message
    });
  }
}

export function* watchFetchScripts() {
  yield takeLatest("FETCH_SCRIPTS", fetchScriptsSaga);
}

export function* watchUploadScript() {
  yield takeLatest("UPLOAD_SCRIPT", uploadScriptSaga);
}
