export const getProcessingLabel = (processingCount, totalCount, action) => {
  const machineString =
    totalCount === 1
      ? "machine"
      : `${totalCount - processingCount} of ${totalCount} machines`;

  switch (action) {
    case "abort":
      return `Aborting actions for ${machineString}...`;
    case "acquire":
      return `Acquiring ${machineString}...`;
    case "commission":
      return `Starting commissioning for ${machineString}...`;
    case "delete":
      return `Deleting ${machineString}...`;
    case "deploy":
      return `Starting deployment for ${machineString}...`;
    case "exit-rescue-mode":
      return `Exiting rescue mode for ${machineString}...`;
    case "lock":
      return `Locking ${machineString}...`;
    case "on":
      return `Powering on ${machineString}...`;
    case "off":
      return `Powering off ${machineString}...`;
    case "mark-broken":
      return `Marking ${machineString} broken...`;
    case "mark-fixed":
      return `Marking ${machineString} fixed...`;
    case "override-failed-testing":
      return `Overriding failed tests for ${machineString}...`;
    case "release":
      return `Releasing ${machineString}...`;
    case "rescue-mode":
      return `Entering rescue mode for ${machineString}...`;
    case "set-pool":
      return `Setting pool for ${machineString}...`;
    case "set-zone":
      return `Setting zone for ${machineString}...`;
    case "tag":
      return `Tagging ${machineString}...`;
    case "test":
      return `Starting tests for ${machineString}...`;
    case "unlock":
      return `Unlocking ${machineString}...`;
    default:
      return `Processing ${machineString}...`;
  }
};
