import { actions } from "./slice";

describe("machine actions", () => {
  it("should handle fetching machines", () => {
    expect(actions.fetch()).toEqual({
      type: "machine/fetch",
      meta: {
        model: "machine",
        method: "list",
        subsequentLimit: 100,
      },
      payload: {
        params: { limit: 25 },
      },
    });
  });

  it("can get machines", () => {
    expect(actions.get("abc123")).toEqual({
      type: "machine/get",
      meta: {
        model: "machine",
        method: "get",
      },
      payload: {
        params: { system_id: "abc123" },
      },
    });
  });

  it("can set an active machine", () => {
    expect(actions.setActive("abc123")).toEqual({
      type: "machine/setActive",
      meta: {
        model: "machine",
        method: "set_active",
      },
      payload: {
        params: { system_id: "abc123" },
      },
    });
  });

  it("can handle creating machines", () => {
    expect(
      actions.create({ name: "machine1", description: "a machine" })
    ).toEqual({
      type: "machine/create",
      meta: {
        model: "machine",
        method: "create",
      },
      payload: {
        params: {
          name: "machine1",
          description: "a machine",
        },
      },
    });
  });

  it("can handle setting the pool", () => {
    expect(actions.setPool("abc123", 909)).toEqual({
      type: "machine/setPool",
      meta: {
        model: "machine",
        method: "action",
      },
      payload: {
        params: {
          action: "set-pool",
          extra: {
            pool_id: 909,
          },
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle setting the zone", () => {
    expect(actions.setZone("abc123", 909)).toEqual({
      type: "machine/setZone",
      meta: {
        model: "machine",
        method: "action",
      },
      payload: {
        params: {
          action: "set-zone",
          extra: {
            zone_id: 909,
          },
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle turning on the machine", () => {
    expect(actions.on("abc123")).toEqual({
      type: "machine/on",
      meta: {
        model: "machine",
        method: "action",
      },
      payload: {
        params: {
          action: "on",
          extra: {},
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle turning off the machine", () => {
    expect(actions.off("abc123")).toEqual({
      type: "machine/off",
      meta: {
        model: "machine",
        method: "action",
      },
      payload: {
        params: {
          action: "off",
          extra: {},
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle checking the machine power", () => {
    expect(actions.checkPower("abc123")).toEqual({
      type: "machine/checkPower",
      meta: {
        model: "machine",
        method: "check_power",
      },
      payload: {
        params: {
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle acquiring a machine", () => {
    expect(actions.acquire("abc123")).toEqual({
      type: "machine/acquire",
      meta: {
        model: "machine",
        method: "action",
      },
      payload: {
        params: {
          action: "acquire",
          extra: {},
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle releasing a machine", () => {
    expect(actions.release("abc123")).toEqual({
      type: "machine/release",
      meta: {
        model: "machine",
        method: "action",
      },
      payload: {
        params: {
          action: "release",
          extra: {},
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle deploying a machine", () => {
    const extra = {
      osystem: "ubuntu",
      distro_series: "bionic",
      install_kvm: false,
    };
    expect(actions.deploy("abc123", extra)).toEqual({
      type: "machine/deploy",
      meta: {
        model: "machine",
        method: "action",
      },
      payload: {
        params: {
          action: "deploy",
          extra,
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle aborting a machine", () => {
    expect(actions.abort("abc123")).toEqual({
      type: "machine/abort",
      meta: {
        model: "machine",
        method: "action",
      },
      payload: {
        params: {
          action: "abort",
          extra: {},
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle commissioning a machine", () => {
    expect(
      actions.commission(
        "abc123",
        true,
        false,
        false,
        false,
        true,
        true,
        [
          { id: 0, name: "commissioningScript0" },
          { id: 2, name: "commissioningScript2" },
        ],
        [
          { id: 0, name: "testingScript0" },
          { id: 2, name: "testScript2" },
        ],
        { testingScript0: { url: "www.url.com" } }
      )
    ).toEqual({
      meta: {
        method: "action",
        model: "machine",
      },
      payload: {
        params: {
          action: "commission",
          extra: {
            enable_ssh: true,
            skip_bmc_config: false,
            skip_networking: false,
            skip_storage: false,
            commissioning_scripts: [0, 2, "update_firmware", "configure_hba"],
            testing_scripts: [0, 2],
            script_input: { testingScript0: { url: "www.url.com" } },
          },
          system_id: "abc123",
        },
      },
      type: "machine/commission",
    });
  });

  it("can handle testing a machine", () => {
    expect(
      actions.test(
        "abc123",
        [
          { id: 0, name: "test0" },
          { id: 2, name: "test2" },
        ],
        true,
        { "test-0": { url: "www.url.com" } }
      )
    ).toEqual({
      type: "machine/test",
      meta: {
        model: "machine",
        method: "action",
      },
      payload: {
        params: {
          action: "test",
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

  it("can create a suppress script results action", () => {
    expect(
      actions.suppressScriptResults(0, [
        { id: 0, name: "script0" },
        { id: 2, name: "script2" },
      ])
    ).toEqual({
      meta: {
        method: "set_script_result_suppressed",
        model: "machine",
      },
      payload: {
        params: {
          script_result_ids: [0, 2],
          system_id: 0,
        },
      },
      type: "machine/suppressScriptResults",
    });
  });

  it("can putting a machine into rescue mode", () => {
    expect(actions.rescueMode("abc123")).toEqual({
      type: "machine/rescueMode",
      meta: {
        model: "machine",
        method: "action",
      },
      payload: {
        params: {
          action: "rescue-mode",
          extra: {},
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle making a machine exit rescue mode", () => {
    expect(actions.exitRescueMode("abc123")).toEqual({
      type: "machine/exitRescueMode",
      meta: {
        model: "machine",
        method: "action",
      },
      payload: {
        params: {
          action: "exit-rescue-mode",
          extra: {},
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle marking a machine as broken", () => {
    expect(actions.markBroken("abc123", "machine is on fire")).toEqual({
      type: "machine/markBroken",
      meta: {
        model: "machine",
        method: "action",
      },
      payload: {
        params: {
          action: "mark-broken",
          extra: {
            message: "machine is on fire",
          },
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle marking a machine as fixed", () => {
    expect(actions.markFixed("abc123")).toEqual({
      type: "machine/markFixed",
      meta: {
        model: "machine",
        method: "action",
      },
      payload: {
        params: {
          action: "mark-fixed",
          extra: {},
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle overriding failed testing on a machine", () => {
    expect(actions.overrideFailedTesting("abc123")).toEqual({
      type: "machine/overrideFailedTesting",
      meta: {
        model: "machine",
        method: "action",
      },
      payload: {
        params: {
          action: "override-failed-testing",
          extra: {},
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle locking a machine", () => {
    expect(actions.lock("abc123")).toEqual({
      type: "machine/lock",
      meta: {
        model: "machine",
        method: "action",
      },
      payload: {
        params: {
          action: "lock",
          extra: {},
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle unlocking a machine", () => {
    expect(actions.unlock("abc123")).toEqual({
      type: "machine/unlock",
      meta: {
        model: "machine",
        method: "action",
      },
      payload: {
        params: {
          action: "unlock",
          extra: {},
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle deleting a machine", () => {
    expect(actions.delete("abc123")).toEqual({
      type: "machine/delete",
      meta: {
        model: "machine",
        method: "action",
      },
      payload: {
        params: {
          action: "delete",
          extra: {},
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle tagging a machine", () => {
    expect(actions.tag("abc123", ["tag1", "tag2"])).toEqual({
      type: "machine/tag",
      meta: {
        model: "machine",
        method: "action",
      },
      payload: {
        params: {
          action: "tag",
          extra: { tags: ["tag1", "tag2"] },
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle applying a machine's storage layout", () => {
    expect(actions.applyStorageLayout("abc123", "blank")).toEqual({
      type: "machine/applyStorageLayout",
      meta: {
        model: "machine",
        method: "apply_storage_layout",
      },
      payload: {
        params: {
          storage_layout: "blank",
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle mounting a special filesystem", () => {
    expect(
      actions.mountSpecial({
        filesystemType: "tmpfs",
        mountOptions: "noexec,size=1024k",
        mountPoint: "/path",
        systemId: "abc123",
      })
    ).toEqual({
      type: "machine/mountSpecial",
      meta: {
        model: "machine",
        method: "mount_special",
      },
      payload: {
        params: {
          fstype: "tmpfs",
          mount_options: "noexec,size=1024k",
          mount_point: "/path",
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle cleaning machines", () => {
    expect(actions.cleanup()).toEqual({
      type: "machine/cleanup",
    });
  });
});
