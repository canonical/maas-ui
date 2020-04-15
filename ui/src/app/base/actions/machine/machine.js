import { createStandardActions } from "app/utils/redux";

const machine = createStandardActions("machine");

machine.fetch = () => {
  return {
    type: "FETCH_MACHINE",
    meta: {
      model: "machine",
      method: "list",
    },
    payload: {
      params: { limit: 25 },
    },
  };
};

machine.create = (params) => {
  return {
    type: "CREATE_MACHINE",
    meta: {
      model: "machine",
      method: "create",
    },
    payload: {
      params,
    },
  };
};

machine.addChassis = (params) => {
  return {
    type: "ADD_MACHINE_CHASSIS",
    payload: {
      params,
    },
  };
};

machine.setSelected = (machines) => {
  return {
    type: "SET_SELECTED_MACHINES",
    payload: machines.map((machine) => machine.system_id),
  };
};

const generateMachineAction = (type, action, systemId, extra = {}) => ({
  type,
  meta: {
    model: "machine",
    method: "action",
  },
  payload: {
    params: {
      action,
      extra,
      system_id: systemId,
    },
  },
});

machine.setPool = (systemId, poolId) =>
  generateMachineAction("SET_MACHINE_POOL", "set-pool", systemId, {
    pool_id: poolId,
  });

machine.setZone = (systemId, zoneId) =>
  generateMachineAction("SET_MACHINE_ZONE", "set-zone", systemId, {
    zone_id: zoneId,
  });

machine.off = (systemId) =>
  generateMachineAction("TURN_MACHINE_OFF", "off", systemId);

machine.on = (systemId) =>
  generateMachineAction("TURN_MACHINE_ON", "on", systemId);

machine.checkPower = (systemId) => {
  return {
    type: "CHECK_MACHINE_POWER",
    meta: {
      model: "machine",
      method: "check_power",
    },
    payload: {
      params: {
        system_id: systemId,
      },
    },
  };
};

machine.acquire = (systemId) =>
  generateMachineAction("ACQUIRE_MACHINE", "acquire", systemId);

machine.release = (systemId) =>
  generateMachineAction("RELEASE_MACHINE", "release", systemId);

machine.commission = (
  systemId,
  enableSSH,
  skipBMCConfig,
  skipNetworking,
  skipStorage,
  commissioningScripts,
  testingScripts
) =>
  generateMachineAction("COMMISSION_MACHINE", "commission", systemId, {
    enable_ssh: enableSSH,
    skip_bmc_config: skipBMCConfig,
    skip_networking: skipNetworking,
    skip_storage: skipStorage,
    commissioning_scripts:
      commissioningScripts && commissioningScripts.map((script) => script.id),
    testingScripts: testingScripts && testingScripts.map((script) => script.id),
  });

machine.deploy = (systemId, extra = {}) =>
  generateMachineAction("DEPLOY_MACHINE", "deploy", systemId, extra);

machine.abort = (systemId) =>
  generateMachineAction("ABORT_MACHINE", "abort", systemId);

machine.test = (systemId, scripts, enableSSH, scriptInputs) =>
  generateMachineAction("TEST_MACHINE", "test", systemId, {
    enable_ssh: enableSSH,
    script_input: scriptInputs,
    testing_scripts: scripts && scripts.map((script) => script.id),
  });

machine.rescueMode = (systemId) =>
  generateMachineAction("MACHINE_RESCUE_MODE", "rescue-mode", systemId);

machine.exitRescueMode = (systemId) =>
  generateMachineAction(
    "MACHINE_EXIT_RESCUE_MODE",
    "exit-rescue-mode",
    systemId
  );

machine.markBroken = (systemId) =>
  generateMachineAction("MARK_MACHINE_BROKEN", "mark-broken", systemId);

machine.markFixed = (systemId) =>
  generateMachineAction("MARK_MACHINE_FIXED", "mark-fixed", systemId);

machine.overrideFailedTesting = (systemId) =>
  generateMachineAction(
    "MACHINE_OVERRIDE_FAILED_TESTING",
    "override-failed-testing",
    systemId
  );

machine.lock = (systemId) =>
  generateMachineAction("LOCK_MACHINE", "lock", systemId);

machine.unlock = (systemId) =>
  generateMachineAction("UNLOCK_MACHINE", "unlock", systemId);

machine.delete = (systemId) =>
  generateMachineAction("DELETE_MACHINE", "delete", systemId);

machine.tag = (systemId, tags) =>
  generateMachineAction("TAG_MACHINE", "tag", systemId, {
    tags: tags.map((tag) => tag.name),
  });

machine.cleanup = () => {
  return {
    type: "CLEANUP_MACHINE",
  };
};

export default machine;
