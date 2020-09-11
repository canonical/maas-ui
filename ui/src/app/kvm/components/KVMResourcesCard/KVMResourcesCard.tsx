import { Card } from "@canonical/react-components";
import classNames from "classnames";
import pluralize from "pluralize";
import React from "react";

import type { Machine } from "app/store/machine/types";
import { formatBytes } from "app/utils";
import { COLOURS } from "app/base/constants";
import ContextualMenu from "app/base/components/ContextualMenu";
import DoughnutChart from "app/base/components/DoughnutChart";
import KVMMeter from "app/kvm/components/KVMMeter";
import { MachineListTable } from "app/machines/views/MachineList/MachineListTable/MachineListTable";

type ChartValues = {
  allocated: number;
  free: number;
};

export type Props = {
  className?: string;
  cores: ChartValues;
  interfaces?: { id: number; name: string; virtualFunctions?: ChartValues }[];
  ram: {
    // All values in B
    general: ChartValues;
    hugepages?: (ChartValues & { pageSize: number })[];
  };
  title?: string;
  vms: Machine[];
};

/**
 * Returns a string with the formatted byte value and unit, e.g 1024 => "1KiB"
 *
 * @param memory - the memory in bytes
 * @returns {string}
 */
const memoryWithUnit = (memory: number): string => {
  const formatted = formatBytes(memory, "B", { binary: true });
  return `${formatted.value}${formatted.unit}`;
};

const KVMResourcesCard = ({
  className,
  cores,
  interfaces,
  ram,
  title,
  vms,
}: Props): JSX.Element => {
  const ifaceNames = interfaces
    ?.map((iface) => iface.name)
    .sort()
    .join(", ") || <em>N/A</em>;
  const [vfsAllocated, vfsFree] = interfaces?.reduce(
    ([allocated, free], iface) => {
      if (iface.virtualFunctions) {
        allocated += iface.virtualFunctions.allocated;
        free += iface.virtualFunctions.free;
      }
      return [allocated, free];
    },
    [0, 0]
  ) || [0, 0];
  const hugepageTotal =
    ram.hugepages?.reduce(
      (sum, hugepage) => sum + hugepage.allocated + hugepage.free,
      0
    ) || 0;

  return (
    <Card className={classNames("kvm-resources-card", className)}>
      {title && (
        <>
          <h5 className="p-text--paragraph u-flex--between u-no-max-width">
            <span data-test="kvm-resources-card-title">{title}</span>
            <ContextualMenu
              dropdownClassName="kvm-machine-list-modal"
              dropdownContent={
                <MachineListTable
                  hiddenColumns={[
                    "owner",
                    "pool",
                    "zone",
                    "fabric",
                    "disks",
                    "storage",
                  ]}
                  machines={vms}
                  showActions={false}
                  paginateLimit={5}
                ></MachineListTable>
              }
              hasToggleIcon
              toggleAppearance="base"
              toggleClassName="kvm-resources-card__vms-button is-dense"
              toggleDisabled={vms.length === 0}
              toggleLabel={pluralize("machine", vms.length, true)}
              position="auto"
            />
          </h5>
          <hr />
        </>
      )}
      <div className="kvm-resources-card__section kvm-resources-card__ram">
        <div>
          <h4 className="p-heading--small">RAM</h4>
          <DoughnutChart
            className="u-align--center"
            label={memoryWithUnit(
              ram.general.allocated + ram.general.free + hugepageTotal
            )}
            segmentHoverWidth={18}
            segmentWidth={15}
            segments={[
              {
                color: COLOURS.LINK,
                tooltip: `General allocated ${memoryWithUnit(
                  ram.general.allocated
                )}`,
                value: ram.general.allocated,
              },
              ...(ram.hugepages || [])
                .map((hugepage) => [
                  {
                    color: COLOURS.POSITIVE,
                    tooltip: `Hugepage allocated ${memoryWithUnit(
                      hugepage.allocated
                    )}`,
                    value: hugepage.allocated,
                  },
                  {
                    color: COLOURS.POSITIVE_MID,
                    tooltip: `Hugepage free ${memoryWithUnit(hugepage.free)}`,
                    value: hugepage.free,
                  },
                ])
                .flat(),
              {
                color: COLOURS.LINK_FADED,
                tooltip: `General free ${memoryWithUnit(ram.general.free)}`,
                value: ram.general.free,
              },
            ]}
            size={96}
          />
        </div>
        <table className="kvm-resources-card__ram-table">
          <thead>
            <tr>
              <th></th>
              <th className="u-align--right u-text--light">
                <span className="u-nudge-left">Allocated</span>
              </th>
              <th className="u-align--right u-text--light">
                <span className="u-nudge-left">Free</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>General</td>
              <td className="u-align--right">
                <span data-test="ram-general-allocated">
                  {memoryWithUnit(ram.general.allocated)}
                </span>
                <span className="u-nudge-right--small">
                  <i className="p-circle--link"></i>
                </span>
              </td>
              <td className="u-align--right">
                <span data-test="ram-general-free">
                  {memoryWithUnit(ram.general.free)}
                </span>
                <span className="u-nudge-right--small">
                  <i className="p-circle--link-faded"></i>
                </span>
              </td>
            </tr>
            {ram.hugepages?.map((hugepage, i) => (
              <tr data-test="hugepage-ram" key={i}>
                <td>
                  Hugepage
                  <br />
                  <strong
                    className="p-text--x-small u-text--light"
                    data-test="hugepage-size"
                  >
                    {`(Size: ${memoryWithUnit(hugepage.pageSize)})`}
                  </strong>
                </td>
                <td className="u-align--right">
                  <span data-test="hugepage-allocated">
                    {memoryWithUnit(hugepage.allocated)}
                  </span>
                  <span className="u-nudge-right--small">
                    <i className="p-circle--positive"></i>
                  </span>
                </td>
                <td className="u-align--right">
                  <span data-test="hugepage-free">
                    {memoryWithUnit(hugepage.free)}
                  </span>
                  <span className="u-nudge-right--small">
                    <i className="p-circle--positive-faded"></i>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="kvm-resources-card__section kvm-resources-card__cpu">
        <h4 className="p-heading--small u-sv1">CPU cores</h4>
        <KVMMeter
          allocated={cores.allocated}
          data-test="cpu-meter"
          free={cores.free}
          segmented
        />
      </div>
      <div className="kvm-resources-card__section kvm-resources-card__vfs">
        {vfsAllocated + vfsFree > 0 ? (
          <>
            <h4 className="p-heading--small u-sv1">Virtual functions</h4>
            <div>
              <KVMMeter
                allocated={vfsAllocated}
                data-test="vfs-meter"
                free={vfsFree}
              />
              <hr />
              <div className="p-heading--small u-text--light">
                Network interfaces
              </div>
              <span>{ifaceNames}</span>
            </div>
          </>
        ) : (
          <>
            <h4 className="p-heading--small u-sv1">Network interfaces</h4>
            <span>{ifaceNames}</span>
          </>
        )}
      </div>
      {!title && (
        <div
          className="kvm-resources-card__section kvm-resources-card__vms"
          data-test="vms-button-no-title"
        >
          <h4 className="p-heading--small">Total VMs</h4>
          <ContextualMenu
            dropdownClassName="kvm-machine-list-modal"
            dropdownContent={
              <MachineListTable
                hiddenColumns={[
                  "owner",
                  "pool",
                  "zone",
                  "fabric",
                  "disks",
                  "storage",
                ]}
                machines={vms}
                showActions={false}
                paginateLimit={5}
              ></MachineListTable>
            }
            hasToggleIcon
            toggleAppearance="base"
            toggleClassName="kvm-resources-card__vms-button is-dense"
            toggleDisabled={vms.length === 0}
            toggleLabel={`${vms.length}`}
            position="auto"
          />
        </div>
      )}
    </Card>
  );
};

export default KVMResourcesCard;
