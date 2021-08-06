import pluralize from "pluralize";

import LabelledList from "app/base/components/LabelledList";
import Placeholder from "app/base/components/Placeholder";
import type { MachineDetails } from "app/store/machine/types";

type Props = {
  machine: MachineDetails | null;
};

export const SourceMachineDetails = ({ machine }: Props): JSX.Element => {
  if (!machine) {
    return (
      <LabelledList
        data-test="placeholder-list"
        items={[
          { label: "Status", value: <Placeholder>Deployed</Placeholder> },
          {
            label: "CPU",
            value: (
              <>
                <Placeholder>X cores, X.X GHz</Placeholder>
                <br />
                <Placeholder>Vendor information</Placeholder>
                <br />
                <Placeholder>Architecture</Placeholder>
              </>
            ),
          },
          { label: "Memory", value: <Placeholder>X GiB</Placeholder> },
          {
            label: "Storage",
            value: <Placeholder>X GB over X disks</Placeholder>,
          },
          { label: "Power type", value: <Placeholder>Power type</Placeholder> },
          { label: "Owner", value: <Placeholder>Owner</Placeholder> },
          { label: "Host", value: <Placeholder>Host name</Placeholder> },
          { label: "Zone", value: <Placeholder>Zone name</Placeholder> },
          { label: "Domain", value: <Placeholder>Domain</Placeholder> },
        ]}
      />
    );
  }
  const {
    architecture,
    cpu_count,
    cpu_speed,
    domain,
    metadata,
    memory,
    owner,
    physical_disk_count,
    pod,
    power_type,
    status,
    storage,
    zone,
  } = machine;
  return (
    <LabelledList
      data-test="source-machine-details"
      items={[
        { label: "Status", value: status },
        {
          label: "CPU",
          value: (
            <>
              <span>
                {pluralize("core", cpu_count, true)}, {cpu_speed / 1000} GHz
              </span>
              <br />
              <span>{metadata.cpu_model || "Unknown model"}</span>
              <br />
              <span>{architecture}</span>
            </>
          ),
        },
        { label: "Memory", value: `${memory} GiB` },
        {
          label: "Storage",
          value: (
            <>
              {storage} GB{" "}
              <small>over {pluralize("disk", physical_disk_count, true)}</small>
            </>
          ),
        },
        { label: "Power type", value: power_type },
        { label: "Owner", value: owner || "-" },
        { label: "Host", value: pod?.name || "-" },
        { label: "Zone", value: zone?.name || "-" },
        { label: "Domain", value: domain?.name || "-" },
      ]}
    />
  );
};

export default SourceMachineDetails;
