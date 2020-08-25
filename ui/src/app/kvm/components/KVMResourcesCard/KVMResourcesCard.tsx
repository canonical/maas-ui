import { Card } from "@canonical/react-components";
import classNames from "classnames";
import React from "react";

import ContextualMenu from "app/base/components/ContextualMenu";
import KVMMeter from "app/kvm/components/KVMMeter";

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
  vfs: ChartValues;
};

const KVMResourcesCard = ({
  className,
  cores,
  nics,
  ram,
  title,
  vfs,
}: Props): JSX.Element => {
  return (
    <Card className={classNames("kvm-resources-card", className)}>
      {title && (
        <>
          <h5
            className="p-text--paragraph"
            data-test="kvm-resources-card-title"
          >
            {title}
          </h5>
          <hr />
        </>
      )}
      <div className="kvm-resources-card__section kvm-resources-card__ram">
        <h4 className="p-heading--small">RAM</h4>
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
                <span className="u-nudge-left--small">
                  <i className="p-circle--link"></i>
                </span>
              </td>
              <td className="u-align--right">
                <span data-test="ram-general-free">
                  {ram.general.free}
                  {ram.general.unit}
                </span>
                <span className="u-nudge-left--small">
                  <i className="p-circle--link-faded"></i>
                </span>
              </td>
            </tr>
            {ram.hugepage && (
              <tr>
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
                  <span className="u-nudge-left--small">
                    <i className="p-circle--positive"></i>
                  </span>
                </td>
                <td className="u-align--right">
                  {ram.hugepage.free}
                  {ram.hugepage.unit}
                  <span className="u-nudge-left--small">
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
          <span>{nics.join(", ")}</span>
        </div>
      </div>
      <div className="kvm-resources-card__section kvm-resources-card__vms">
        <h4 className="p-heading--small">Total VMs</h4>
        <ContextualMenu
          dropdownContent={<></>}
          hasToggleIcon
          toggleAppearance="base"
          toggleClassName="is-dense is-thin"
          toggleLabel="4"
        />
      </div>
    </Card>
  );
};

export default KVMResourcesCard;
