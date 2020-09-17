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

machine.setSelected = (machineIDs) => {
  return {
    type: "SET_SELECTED_MACHINES",
    payload: machineIDs,
  };
};

machine.fetchFailedScriptResults = (machines) => ({
  type: "FETCH_FAILED_SCRIPT_RESULTS",
  meta: {
    model: "machine",
    method: "get_latest_failed_testing_script_results",
  },
  payload: {
    params: {
      system_ids: machines.map((machine) => machine.system_id),
    },
  },
});

machine.suppressScriptResults = (machine, scripts) => ({
  type: "SET_SCRIPT_RESULT_SUPPRESSED",
  meta: {
    model: "machine",
    method: "set_script_result_suppressed",
  },
  payload: {
    params: {
      system_id: machine.system_id,
      script_result_ids: scripts.map((script) => script.id),
    },
  },
});

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
  updateFirmware,
  configureHBA,
  commissioningScripts,
  testingScripts,
  scriptInputs
) => {
  let formattedCommissioningScripts = [];
  if (commissioningScripts && commissioningScripts.length > 0) {
    formattedCommissioningScripts = commissioningScripts.map(
      (script) => script.id
    );
    if (updateFirmware) {
      formattedCommissioningScripts.push("update_firmware");
    }
    if (configureHBA) {
      formattedCommissioningScripts.push("configure_hba");
    }
  }

  return generateMachineAction("COMMISSION_MACHINE", "commission", systemId, {
    enable_ssh: enableSSH,
    skip_bmc_config: skipBMCConfig,
    skip_networking: skipNetworking,
    skip_storage: skipStorage,
    commissioning_scripts: formattedCommissioningScripts,
    testing_scripts:
      testingScripts && testingScripts.map((script) => script.id),
    script_input: scriptInputs,
  });
};

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

machine.markBroken = (systemId, message) =>
  generateMachineAction("MARK_MACHINE_BROKEN", "mark-broken", systemId, {
    message,
  });

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
