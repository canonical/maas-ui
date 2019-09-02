import { call } from "redux-saga/effects";
import * as matchers from "redux-saga-test-plan/matchers";
import { throwError } from "redux-saga-test-plan/providers";

import { expectSaga } from "redux-saga-test-plan";

import getCookie from "./utils";
import { api, fetchScriptsSaga } from "./http";

describe("http sagas", () => {
  it("returns a SUCCESS action", () => {
    const payload = [{ name: "script1" }];
    return expectSaga(fetchScriptsSaga)
      .provide([
        [matchers.call.fn(getCookie, "csrftoken"), "csrf-token"],
        [matchers.call.fn(api.fetchScripts, "csrf-token"), payload]
      ])
      .put({ type: "FETCH_SCRIPTS_START" })
      .put({ type: "FETCH_SCRIPTS_SUCCESS", payload })
      .run();
  });

  it("handles errors", () => {
    const error = new Error("kerblam!");
    return expectSaga(fetchScriptsSaga)
      .provide([
        [matchers.call.fn(getCookie, "csrftoken"), "csrf-token"],
        [matchers.call.fn(api.fetchScripts, "csrf-token"), throwError(error)]
      ])
      .put({ type: "FETCH_SCRIPTS_START" })
      .put({ type: "FETCH_SCRIPTS_ERROR", error })
      .run();
  });
});
