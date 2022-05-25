import { memo } from "react";

import { Tooltip } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom-v5-compat";

import DoubleRow from "app/base/components/DoubleRow";
import NonBreakingSpace from "app/base/components/NonBreakingSpace";
import RowCheckbox from "app/base/components/RowCheckbox";
import machineSelectors from "app/store/machine/selectors";
import type { Machine, MachineMeta } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";

type Props = {
  handleCheckbox?: () => void;
  selected: Machine[MachineMeta.PK][];
  showMAC?: boolean;
  systemId: Machine[MachineMeta.PK];
};

const generateFQDN = (machine: Machine, machineURL: string) => {
  return (
    <Link to={machineURL} title={machine.fqdn}>
      <strong data-testid="hostname">
        {machine.locked ? (
          <span title="This machine is locked. You have to unlock it to perform any actions.">
            <i className="p-icon--locked">Locked: </i>{" "}
          </span>
        ) : null}
        {machine.hostname}
      </strong>
      <small>.{machine.domain.name}</small>
    </Link>
  );
};

const generateIPAddresses = (machine: Machine) => {
  const ipAddresses: string[] = [];
  let bootIP;

  (machine.ip_addresses || []).forEach((address) => {
    let ip = address.ip;
    if (address.is_boot) {
      ip = `${ip} (PXE)`;
      bootIP = ip;
    }
    if (!ipAddresses.includes(ip)) {
      ipAddresses.push(ip);
    }
  });

  if (ipAddresses.length) {
    const ipAddressesLine = (
      <span
        data-testid="ip-addresses"
        title={ipAddresses.length === 1 ? ipAddresses[0] : ""}
      >
        {bootIP || ipAddresses[0]}
        {ipAddresses.length > 1 ? ` (+${ipAddresses.length - 1})` : null}
      </span>
    );

    if (ipAddresses.length === 1) {
      return ipAddressesLine;
    }
    return (
      <Tooltip
        position="btm-left"
        message={
          <>
            <strong>{ipAddresses.length} interfaces:</strong>
            <ul className="p-list u-no-margin--bottom">
              {ipAddresses.map((address) => (
                <li key={address}>{address}</li>
              ))}
            </ul>
          </>
        }
        positionElementClassName="p-double-row__tooltip-inner"
      >
        {ipAddressesLine}
      </Tooltip>
    );
  }
  return "";
};

const generateMAC = (machine: Machine, machineURL: string) => {
  return (
    <>
      <Link to={machineURL} title={machine.pxe_mac_vendor}>
        {machine.pxe_mac}
      </Link>
      {machine.extra_macs && machine.extra_macs.length > 0 ? (
        <Link to={machineURL}> (+{machine.extra_macs.length})</Link>
      ) : null}
    </>
  );
};

export const NameColumn = ({
  handleCheckbox,
  selected,
  showMAC,
  systemId,
}: Props): JSX.Element | null => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  if (!machine) {
    return null;
  }
  const machineURL = `/${machine.link_type}/${machine.system_id}`;
  const primaryRow = showMAC
    ? generateMAC(machine, machineURL)
    : generateFQDN(machine, machineURL);
  const secondaryRow = !showMAC && generateIPAddresses(machine);

  return (
    <DoubleRow
      data-testid="name-column"
      primary={
        handleCheckbox ? (
          <RowCheckbox
            handleRowCheckbox={handleCheckbox}
            item={systemId}
            items={selected}
            inputLabel={primaryRow}
          />
        ) : (
          primaryRow
        )
      }
      // fallback to non-breaking space to keep equal height of all rows
      secondary={secondaryRow || <NonBreakingSpace />}
      secondaryClassName={
        handleCheckbox && "u-nudge--secondary-row u-align--left"
      }
    />
  );
};

export default memo(NameColumn);
