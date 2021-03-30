import * as matchers from "redux-saga-test-plan/matchers";
import { throwError } from "redux-saga-test-plan/providers";

import { expectSaga } from "redux-saga-test-plan";

import { getCookie } from "app/utils";
import {
  api,
  checkAuthenticatedSaga,
  loginSaga,
  logoutSaga,
  externalLoginSaga,
  fetchScriptsSaga,
  deleteScriptSaga,
  uploadScriptSaga,
  fetchLicenseKeysSaga,
  updateLicenseKeySaga,
  deleteLicenseKeySaga,
  addMachineChassisSaga,
} from "./http";

jest.mock("../../../bakery", () => {});

describe("http sagas", () => {
  describe("Auth API", () => {
    beforeEach(() => {
      fetch.resetMocks();
    });

    describe("check authenticated", () => {
      it("returns a SUCCESS action", () => {
        const payload = { authenticated: true };
        return expectSaga(checkAuthenticatedSaga)
          .provide([[matchers.call.fn(api.auth.checkAuthenticated), payload]])
          .put({ type: "status/checkAuthenticatedStart" })
          .put({
            type: "status/checkAuthenticatedSuccess",
            payload,
          })
          .run();
      });

      it("handles errors", () => {
        const error = new Error("kerblam!");
        return expectSaga(checkAuthenticatedSaga)
          .provide([
            [matchers.call.fn(api.auth.checkAuthenticated), throwError(error)],
          ])
          .put({ type: "status/checkAuthenticatedStart" })
          .put({
            error: true,
            type: "status/checkAuthenticatedError",
            payload: error.message,
          })
          .run();
      });
    });

    describe("login", () => {
      it("returns a SUCCESS action", () => {
        const payload = {
          username: "koala",
          password: "gumtree",
        };
        const action = {
          type: "status/login",
          payload,
        };
        return expectSaga(loginSaga, action)
          .provide([[matchers.call.fn(api.auth.login, payload)]])
          .put({ type: "status/loginStart" })
          .put({ type: "status/loginSuccess" })
          .run();
      });

      it("handles errors", () => {
        const payload = {
          username: "koala",
          password: "gumtree",
        };
        const action = {
          type: "status/login",
          payload,
        };
        const error = {
          message: "Username not provided",
        };
        return expectSaga(loginSaga, action)
          .provide([
            [matchers.call.fn(api.auth.login, payload), throwError(error)],
          ])
          .put({ type: "status/loginStart" })
          .put({ type: "status/loginError", error: true, payload: error })
          .run();
      });

      it("encodes special characters", () => {
        api.auth.login({
          username: "ko&ala",
          password: "gum%tree",
        });
        expect(fetch).toHaveBeenCalled();
        expect(fetch.mock.calls[0][1].body.toString()).toBe(
          "username=ko%26ala&password=gum%25tree"
        );
      });
    });

    describe("externalLogin", () => {
      it("returns a SUCCESS action", () => {
        const action = {
          type: "status/externalLogin",
        };
        return expectSaga(externalLoginSaga, action)
          .provide([[matchers.call.fn(api.auth.externalLogin)]])
          .put({ type: "status/externalLoginStart" })
          .put({ type: "status/externalLoginSuccess" })
          .run();
      });

      it("handles errors", () => {
        const action = {
          type: "status/externalLogin",
        };
        const error = {
          message: "Unable to log in",
        };
        return expectSaga(externalLoginSaga, action)
          .provide([
            [matchers.call.fn(api.auth.externalLogin), throwError(error)],
          ])
          .put({ type: "status/externalLoginStart" })
          .put({
            type: "status/externalLoginError",
            error: true,
            payload: error.message,
          })
          .run();
      });
    });

    describe("logout", () => {
      it("returns a SUCCESS action", () => {
        return expectSaga(logoutSaga, {
          type: "status/logout",
        })
          .provide([
            [matchers.call.fn(getCookie, "csrftoken"), "csrf-token"],
            [matchers.call.fn(api.auth.logout, "csrf-token")],
          ])
          .put({ type: "status/logoutStart" })
          .put({ type: "status/logoutSuccess" })
          .put({ type: "status/websocketDisconnect" })
          .run();
      });

      it("handles errors", () => {
        const error = {
          message: "Username not provided",
        };
        return expectSaga(logoutSaga, {
          type: "status/logout",
        })
          .provide([
            [matchers.call.fn(getCookie, "csrftoken"), "csrf-token"],
            [
              matchers.call.fn(api.auth.logout, "csrf-token"),
              throwError(error),
            ],
          ])
          .put({ type: "status/logoutStart" })
          .put({
            type: "status/logoutError",
            error: true,
            payload: { error: error.message },
          })
          .run();
      });
    });
  });
  describe("Scripts API", () => {
    describe("fetch scripts", () => {
      it("returns a SUCCESS action", () => {
        const payload = [{ name: "script1" }];
        return expectSaga(fetchScriptsSaga)
          .provide([
            [matchers.call.fn(getCookie, "csrftoken"), "csrf-token"],
            [matchers.call.fn(api.scripts.fetch, "csrf-token"), payload],
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
            [
              matchers.call.fn(api.scripts.fetch, "csrf-token"),
              throwError(error),
            ],
          ])
          .put({ type: "FETCH_SCRIPTS_START" })
          .put({
            type: "FETCH_SCRIPTS_ERROR",
            errors: { error: error.message },
          })
          .run();
      });
    });

    describe("delete scripts", () => {
      it("returns a SUCCESS action", () => {
        const action = {
          type: "DELETE_SCRIPT",
          payload: { id: 1, name: "script-1" },
        };
        return expectSaga(deleteScriptSaga, action)
          .provide([
            [matchers.call.fn(getCookie, "csrftoken"), "csrf-token"],
            [
              matchers.call.fn(api.scripts.delete, "csrf-token", "script-1"),
              true,
            ],
          ])
          .put({ type: "DELETE_SCRIPT_START" })
          .put({ type: "DELETE_SCRIPT_SUCCESS", payload: 1 })
          .run();
      });

      it("handles errors", () => {
        const action = { type: "DELETE_SCRIPT", payload: { name: "script-1" } };
        const error = new Error("kerblam!");
        return expectSaga(deleteScriptSaga, action)
          .provide([
            [matchers.call.fn(getCookie, "csrftoken"), "csrf-token"],
            [
              matchers.call.fn(api.scripts.delete, "csrf-token", "script-1"),
              throwError(error),
            ],
          ])
          .put({ type: "DELETE_SCRIPT_START" })
          .put({
            type: "DELETE_SCRIPT_ERROR",
            errors: { error: error.message },
          })
          .run();
      });
    });

    describe("upload scripts", () => {
      it("returns a SUCCESS action", () => {
        const script = {
          name: "script-1",
          type: "commissioning",
          script: "#!/bin/sh/necho 'hi'",
        };
        const action = {
          type: "UPLOAD_SCRIPT",
          payload: script,
        };
        return expectSaga(uploadScriptSaga, action)
          .provide([
            [matchers.call.fn(getCookie, "csrftoken"), "csrf-token"],
            [
              matchers.call.fn(api.scripts.upload, "csrf-token", "script-1"),
              script,
            ],
          ])
          .put({ type: "UPLOAD_SCRIPT_START" })
          .put({ type: "UPLOAD_SCRIPT_SUCCESS", payload: script })
          .run();
      });

      it("handles errors", () => {
        const script = {
          name: "script-1",
          type: "commissioning",
          script: "#!/bin/sh/necho 'hi'",
        };
        const action = { type: "UPLOAD_SCRIPT", payload: script };
        const error = {
          name: "Script with that name already exists",
        };
        return expectSaga(uploadScriptSaga, action)
          .provide([
            [matchers.call.fn(getCookie, "csrftoken"), "csrf-token"],
            [
              matchers.call.fn(api.scripts.upload, "csrf-token", "script-1"),
              throwError(error),
            ],
          ])
          .put({ type: "UPLOAD_SCRIPT_START" })
          .put({ type: "UPLOAD_SCRIPT_ERROR", errors: { name: error.name } })
          .run();
      });
    });
  });

  describe("License Key API", () => {
    describe("fetch license keys", () => {
      it("returns a SUCCESS action", () => {
        const payload = [{ osystem: "windows", distro_series: "2012" }];
        return expectSaga(fetchLicenseKeysSaga)
          .provide([
            [matchers.call.fn(getCookie, "csrftoken"), "csrf-token"],
            [matchers.call.fn(api.licenseKeys.fetch, "csrf-token"), payload],
          ])
          .put({ type: "licensekeys/fetchStart" })
          .put({ type: "licensekeys/fetchSuccess", payload })
          .run();
      });
    });

    describe("update license keys", () => {
      it("returns a SUCCESS action", () => {
        const payload = {
          osystem: "windows",
          distro_series: "2012",
          license_key: "foo",
        };
        const action = {
          type: "licensekeys/update",
          payload,
        };
        return expectSaga(updateLicenseKeySaga, action)
          .provide([
            [matchers.call.fn(getCookie, "csrftoken"), "csrf-token"],
            [
              matchers.call.fn(
                api.licenseKeys.update,
                payload.license_key,
                "csrf-token"
              ),
              payload,
            ],
          ])
          .put({ type: "licensekeys/updateStart" })
          .put({ type: "licensekeys/updateSuccess", payload })
          .run();
      });
    });

    describe("delete license keys", () => {
      it("returns a SUCCESS action", () => {
        const payload = { osystem: "windows", distro_series: "2012" };
        const action = {
          type: "licensekeys/delete",
          payload,
        };
        return expectSaga(deleteLicenseKeySaga, action)
          .provide([
            [matchers.call.fn(getCookie, "csrftoken"), "csrf-token"],
            [
              matchers.call.fn(
                api.licenseKeys.delete,
                payload.osystem,
                payload.distro_series,
                "csrf-token"
              ),
              true,
            ],
          ])
          .put({ type: "licensekeys/deleteStart" })
          .put({ type: "licensekeys/deleteSuccess", payload })
          .run();
      });
    });
  });

  describe("Machines API", () => {
    describe("add machine chassis", () => {
      it("returns a success action", () => {
        const payload = {
          params: {
            chassis_type: "powerkvm",
            hostname: "qemu+ssh://virsh@127.0.0.1/system",
          },
        };
        const action = {
          type: "machine/addChassis",
          payload,
        };
        return expectSaga(addMachineChassisSaga, action)
          .provide([
            [matchers.call.fn(getCookie, "csrftoken"), "csrf-token"],
            [matchers.call.fn(api.machines.addChassis, "csrf-token"), payload],
          ])
          .put({ type: "machine/addChassisStart" })
          .put({ type: "machine/addChassisSuccess", payload })
          .run();
      });

      it("handles errors", () => {
        const payload = {
          params: {
            hostname: "qemu+ssh://virsh@127.0.0.1/system",
          },
        };
        const action = { type: "machine/addChassis", payload };
        const error = "Chassis type not provided";
        return expectSaga(addMachineChassisSaga, action)
          .provide([
            [matchers.call.fn(getCookie, "csrftoken"), "csrf-token"],
            [
              matchers.call.fn(api.machines.addChassis, "csrf-token", payload),
              throwError(error),
            ],
          ])
          .put({ type: "machine/addChassisStart" })
          .put({
            type: "machine/addChassisError",
            payload: "Chassis type not provided",
          })
          .run();
      });
    });
  });
});
