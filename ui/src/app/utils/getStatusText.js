import { nodeStatus } from "app/base/enum";

// Node statuses for which the OS + release is made human-readable.
const formattedReleaseStatuses = [nodeStatus.DEPLOYED, nodeStatus.DEPLOYING];

/**
 * Returns formatted status text of a given machine.
 * @param {Object} machine - the machine who's status you are checking.
 * @param {Array{}} osReleases - list of OS release options.
 * @returns {String} formatted status text
 */
export const getStatusText = (machine, osReleases) => {
  if (!machine) {
    return "Unknown";
  }
  if (formattedReleaseStatuses.includes(machine.status_code)) {
    const machineRelease = osReleases.find(
      (release) => release.value === machine.distro_series
    );

    if (machineRelease) {
      let releaseTitle;
      if (machine.osystem === "ubuntu") {
        releaseTitle = machineRelease.label.split('"')[0].trim();
      } else {
        releaseTitle = machineRelease.label;
      }

      if (machine.status_code === nodeStatus.DEPLOYING) {
        return `Deploying ${releaseTitle}`;
      }
      return releaseTitle;
    }
  }
  return machine.status;
};
