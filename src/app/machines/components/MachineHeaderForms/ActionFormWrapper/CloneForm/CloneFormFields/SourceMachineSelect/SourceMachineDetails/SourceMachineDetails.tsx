import pluralize from "pluralize";

import LabelledList from "app/base/components/LabelledList";
import Placeholder from "app/base/components/Placeholder";
import type { MachineDetails } from "app/store/machine/types";

type Props = {
  machine: MachineDetails | null;
};

export const SourceMachineDetails = ({ machine }: Props): JSX.Element => {
  // Placeholder content is displayed until the machine has loaded.
  let content = {
    architecture: "Architecture",
    cores: "X cores, X.X GHz",
    cpuModel: "Model information",
    domain: "Domain",
    host: "Host name",
    memory: "X GiB",
    owner: "Owner",
    powerType: "Power type",
    status: "Machine status",
    storage: (
      <>
        X GB <small>over X disks</small>
      </>
    ),
    zone: "Zone name",
  };

  if (machine) {
    content = {
      architecture: machine.architecture,
      cores: `${pluralize("core", machine.cpu_count, true)}, ${
        machine.cpu_speed / 1000
      } GHz`,
      cpuModel: machine.metadata?.cpu_model || "Unknown model",
      domain: machine.domain?.name || "-",
      host: machine.pod?.name || "-",
      memory: `${machine.memory} GiB`,
      owner: machine.owner || "-",
      powerType: machine.power_type || "Unknown",
      status: machine.status,
      storage: (
        <>
          {machine.storage} GB{" "}
          <small>
            over {pluralize("disk", machine.physical_disk_count, true)}
          </small>
        </>
      ),
      zone: machine.zone?.name || "-",
    };
  }

  return (
    <LabelledList
      data-testid="source-machine-details"
      items={[
        {
          label: "Status",
          value: <Placeholder loading={!machine}>{content.status}</Placeholder>,
        },
        {
          label: "CPU",
          value: (
            <>
              <Placeholder loading={!machine}>{content.cores}</Placeholder>
              <br />
              <Placeholder loading={!machine}>{content.cpuModel}</Placeholder>
              <br />
              <Placeholder loading={!machine}>
                {content.architecture}
              </Placeholder>
            </>
          ),
        },
        {
          label: "Memory",
          value: <Placeholder loading={!machine}>{content.memory}</Placeholder>,
        },
        {
          label: "Storage",
          value: (
            <Placeholder loading={!machine}>{content.storage}</Placeholder>
          ),
        },
        {
          label: "Power type",
          value: (
            <Placeholder loading={!machine}>{content.powerType}</Placeholder>
          ),
        },
        {
          label: "Owner",
          value: <Placeholder loading={!machine}>{content.owner}</Placeholder>,
        },
        {
          label: "Host",
          value: <Placeholder loading={!machine}>{content.host}</Placeholder>,
        },
        {
          label: "Zone",
          value: <Placeholder loading={!machine}>{content.zone}</Placeholder>,
        },
        {
          label: "Domain",
          value: <Placeholder loading={!machine}>{content.domain}</Placeholder>,
        },
      ]}
    />
  );
};

export default SourceMachineDetails;
