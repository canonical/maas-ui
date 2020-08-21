import { Card } from "@canonical/react-components";
import classNames from "classnames";
import React from "react";

import ContextualMenu from "app/base/components/ContextualMenu";
import Meter from "app/base/components/Meter";

type Props = {
  className?: string;
  title?: string;
};

const KVMResourcesCard = ({ className, title }: Props): JSX.Element => {
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
                64GB
                <span className="u-nudge-left--small">
                  <i className="p-circle--link"></i>
                </span>
              </td>
              <td className="u-align--right">
                96GB
                <span className="u-nudge-left--small">
                  <i className="p-circle--link-faded"></i>
                </span>
              </td>
            </tr>
            <tr>
              <td>
                Hugepage
                <br />
                <strong className="p-text--x-small u-text--light">
                  (Size: 2048KB)
                </strong>
              </td>
              <td className="u-align--right">
                32GB
                <span className="u-nudge-left--small">
                  <i className="p-circle--positive"></i>
                </span>
              </td>
              <td className="u-align--right">
                64GB
                <span className="u-nudge-left--small">
                  <i className="p-circle--positive-faded"></i>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="kvm-resources-card__section kvm-resources-card__cpu">
        <h4 className="p-heading--small">CPU cores</h4>
        <Meter data={[]} />
      </div>
      <div className="kvm-resources-card__section kvm-resources-card__vfs">
        <h4 className="p-heading--small">Virtual functions</h4>
        <div>
          <Meter data={[]} />
          <hr />
          <div className="p-heading--small u-text--light">
            Network interfaces
          </div>
          <span>eth0, eth1, eth2, eth3</span>
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
