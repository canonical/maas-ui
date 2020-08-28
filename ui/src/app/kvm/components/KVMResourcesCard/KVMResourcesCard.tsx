import { Card } from "@canonical/react-components";
import classNames from "classnames";
import pluralize from "pluralize";
import React from "react";

import { COLOURS } from "app/base/constants";
import ContextualMenu from "app/base/components/ContextualMenu";
import DoughnutChart from "app/base/components/DoughnutChart";
import KVMMeter from "app/kvm/components/KVMMeter";
import { MachineListTable } from "app/machines/views/MachineList/MachineListTable/MachineListTable";

type ChartValues = {
  allocated: number;
  free: number;
  total: number;
  unit?: string;
};

type Props = {
  className?: string;
  cores: ChartValues;
  nics: string[];
  ram: {
    general: ChartValues;
    hugepage?: ChartValues & { pagesize: number };
  };
  title?: string;
  vfs?: ChartValues;
  vms: string[];
};

const KVMResourcesCard = ({
  className,
  cores,
  nics,
  ram,
  title,
  vfs,
  vms,
}: Props): JSX.Element => {
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
                    "power",
                    "owner",
                    "pool",
                    "zone",
                    "fabric",
                    "disks",
                    "storage",
                  ]}
                  showActions={false}
                  paginateLimit={5}
                ></MachineListTable>
              }
              hasToggleIcon
              toggleAppearance="base"
              toggleClassName="kvm-resources-card__vms-button is-dense"
              toggleDisabled={vms.length === 0}
              toggleLabel={pluralize("machine", vms.length, true)}
              position="left"
            />
          </h5>
          <hr />
        </>
      )}
      <div className="kvm-resources-card__section kvm-resources-card__ram">
        <div>
          <h4 className="p-heading--small">RAM</h4>
          <DoughnutChart
            className="kvm-resources-card__ram-chart"
            label={`${ram.general.total + (ram.hugepage?.total || 0)}${
              ram.general.unit
            }`}
            segmentHoverWidth={18}
            segmentWidth={15}
            segments={[
              {
                color: COLOURS.LINK,
                tooltip: `General allocated ${ram.general.allocated}${ram.general.unit}`,
                value: ram.general.allocated,
              },
              ...(ram.hugepage
                ? [
                    {
                      color: COLOURS.POSITIVE,
                      tooltip: `Hugepage allocated ${ram.hugepage.allocated}${ram.hugepage.unit}`,
                      value: ram.hugepage.allocated,
                    },
                    {
                      color: COLOURS.POSITIVE_MID,
                      tooltip: `Hugepage free ${ram.hugepage.free}${ram.hugepage.unit}`,
                      value: ram.hugepage.free,
                    },
                  ]
                : []),
              {
                color: COLOURS.LINK_FADED,
                tooltip: `General free ${ram.general.free}${ram.general.unit}`,
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
              <th className="u-align--right">
                <span className="u-nudge-left">Allocated</span>
              </th>
              <th className="u-align--right">
                <span className="u-nudge-left">Free</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>General</td>
              <td className="u-align--right">
                <span data-test="ram-general-allocated">
                  {ram.general.allocated}
                  {ram.general.unit}
                </span>
                <span className="u-nudge-right--small">
                  <i className="p-circle--link"></i>
                </span>
              </td>
              <td className="u-align--right">
                <span data-test="ram-general-free">
                  {ram.general.free}
                  {ram.general.unit}
                </span>
                <span className="u-nudge-right--small">
                  <i className="p-circle--link-faded"></i>
                </span>
              </td>
            </tr>
            {ram.hugepage && (
              <tr data-test="hugepage-ram">
                <td>
                  Hugepage
                  <br />
                  <strong className="p-text--x-small u-text--light">
                    {`(Size: ${ram.hugepage.pagesize}KB)`}
                  </strong>
                </td>
                <td className="u-align--right">
                  {ram.hugepage.allocated}
                  {ram.hugepage.unit}
                  <span className="u-nudge-right--small">
                    <i className="p-circle--positive"></i>
                  </span>
                </td>
                <td className="u-align--right">
                  {ram.hugepage.free}
                  {ram.hugepage.unit}
                  <span className="u-nudge-right--small">
                    <i className="p-circle--positive-faded"></i>
                  </span>
                </td>
              </tr>
            )}
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
          total={cores.total}
        />
      </div>
      <div className="kvm-resources-card__section kvm-resources-card__vfs">
        {vfs ? (
          <>
            <h4 className="p-heading--small u-sv1">Virtual functions</h4>
            <div>
              <KVMMeter
                allocated={vfs.allocated}
                data-test="vfs-meter"
                free={vfs.free}
                total={vfs.total}
              />
              <hr />
              <div className="p-heading--small u-text--light">
                Network interfaces
              </div>
              <span>{nics.length >= 1 ? nics.join(", ") : <em>None</em>}</span>
            </div>
          </>
        ) : (
          <>
            <h4 className="p-heading--small u-sv1">Network interfaces</h4>
            <span>{nics.length >= 1 ? nics.join(", ") : <em>None</em>}</span>
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
                  "power",
                  "owner",
                  "pool",
                  "zone",
                  "fabric",
                  "disks",
                  "storage",
                ]}
                showActions={false}
                paginateLimit={5}
              ></MachineListTable>
            }
            hasToggleIcon
            toggleAppearance="base"
            toggleClassName="kvm-resources-card__vms-button is-dense"
            toggleLabel={`${vms.length}`}
            position="right"
          />
        </div>
      )}
    </Card>
  );
};

export default KVMResourcesCard;
