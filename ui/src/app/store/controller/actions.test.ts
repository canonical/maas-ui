import { actions } from "./slice";

import { NodeActions } from "app/store/types/node";
import {
  script as scriptFactory,
  scriptResult as scriptResultFactory,
} from "testing/factories";

describe("controller actions", () => {
  it("should handle checking images", () => {
    expect(actions.checkImages(["abc123", "def456"])).toEqual({
      type: "controller/checkImages",
      meta: {
        model: "controller",
        method: "check_images",
      },
      payload: { params: [{ system_id: "abc123" }, { system_id: "def456" }] },
    });
  });

  it("should handle polling checking images", () => {
    expect(actions.pollCheckImages(["abc123", "def456"], "pollid123")).toEqual({
      type: "controller/pollCheckImages",
      meta: {
        model: "controller",
        method: "check_images",
        poll: true,
        pollId: "pollid123",
        pollInterval: 30000,
      },
      payload: { params: [{ system_id: "abc123" }, { system_id: "def456" }] },
    });
  });

  it("should handle stop polling checking images", () => {
    expect(actions.pollCheckImagesStop("pollid123")).toEqual({
      type: "controller/pollCheckImagesStop",
      meta: {
        model: "controller",
        method: "check_images",
        pollId: "pollid123",
        pollStop: true,
      },
      payload: null,
    });
  });

  it("should handle fetching controllers", () => {
    expect(actions.fetch()).toEqual({
      type: "controller/fetch",
      meta: {
        model: "controller",
        method: "list",
      },
      payload: null,
    });
  });

  it("should handle creating controllers", () => {
    expect(
      actions.create({
        description: "a controller",
      })
    ).toEqual({
      type: "controller/create",
      meta: {
        model: "controller",
        method: "create",
      },
      payload: {
        params: {
          description: "a controller",
        },
      },
    });
  });

  it("should handle updating controllers", () => {
    expect(
      actions.update({
        system_id: "abc123",
        description: "an updated controller",
      })
    ).toEqual({
      type: "controller/update",
      meta: {
        model: "controller",
        method: "update",
      },
      payload: {
        params: {
          system_id: "abc123",
          description: "an updated controller",
        },
      },
    });
  });

  it("can get a controller", () => {
    expect(actions.get("abc123")).toEqual({
      type: "controller/get",
      meta: {
        model: "controller",
        method: "get",
      },
      payload: {
        params: { system_id: "abc123" },
      },
    });
  });

  it("can set an active controller", () => {
    expect(actions.setActive("abc123")).toEqual({
      type: "controller/setActive",
      meta: {
        model: "controller",
        method: "set_active",
      },
      payload: {
        params: { system_id: "abc123" },
      },
    });
  });

  it("can handle deleting a controller", () => {
    expect(actions.delete("abc123")).toEqual({
      type: "controller/delete",
      meta: {
        model: "controller",
        method: "action",
      },
      payload: {
        params: {
          action: NodeActions.DELETE,
          extra: {},
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle setting selected controllers", () => {
    expect(actions.setSelected(["abc123", "def456"])).toEqual({
      type: "controller/setSelected",
      payload: ["abc123", "def456"],
    });
  });

  it("can handle setting the zone", () => {
    expect(actions.setZone({ systemId: "abc123", zoneId: 909 })).toEqual({
      type: "controller/setZone",
      meta: {
        model: "controller",
        method: "action",
      },
      payload: {
        params: {
          action: NodeActions.SET_ZONE,
          extra: {
            zone_id: 909,
          },
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle turning on the controller", () => {
    expect(actions.on("abc123")).toEqual({
      type: "controller/on",
      meta: {
        model: "controller",
        method: "action",
      },
      payload: {
        params: {
          action: NodeActions.ON,
          extra: {},
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle turning off the controller", () => {
    expect(actions.off("abc123")).toEqual({
      type: "controller/off",
      meta: {
        model: "controller",
        method: "action",
      },
      payload: {
        params: {
          action: NodeActions.OFF,
          extra: {},
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle testing a controller", () => {
    expect(
      actions.test({
        systemId: "abc123",
        scripts: [
          scriptFactory({ id: 0, name: "test0" }),
          scriptFactory({ id: 2, name: "test2" }),
        ],
        enableSSH: true,
        scriptInputs: { "test-0": { url: "www.url.com" } },
      })
    ).toEqual({
      type: "controller/test",
      meta: {
        model: "controller",
        method: "action",
      },
      payload: {
        params: {
          action: NodeActions.TEST,
          extra: {
            enable_ssh: true,
            script_input: { "test-0": { url: "www.url.com" } },
            testing_scripts: [0, 2],
          },
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle overriding failed testing on a controller", () => {
    expect(actions.overrideFailedTesting("abc123")).toEqual({
      type: "controller/overrideFailedTesting",
      meta: {
        model: "controller",
        method: "action",
      },
      payload: {
        params: {
          action: NodeActions.OVERRIDE_FAILED_TESTING,
          extra: {},
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle importing images", () => {
    expect(actions.importImages("abc123")).toEqual({
      type: "controller/importImages",
      meta: {
        model: "controller",
        method: "action",
      },
      payload: {
        params: {
          action: NodeActions.IMPORT_IMAGES,
          extra: {},
          system_id: "abc123",
        },
      },
    });
  });

  it("can create a suppress script results action", () => {
    expect(
      actions.suppressScriptResults("abc123", [
        scriptResultFactory({ id: 0, name: "script0" }),
        scriptResultFactory({ id: 2, name: "script2" }),
      ])
    ).toEqual({
      meta: {
        method: "set_script_result_suppressed",
        model: "controller",
      },
      payload: {
        params: {
          script_result_ids: [0, 2],
          system_id: "abc123",
        },
      },
      type: "controller/suppressScriptResults",
    });
  });
});
