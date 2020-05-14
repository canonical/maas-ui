import { Input } from "@canonical/react-components";
import { useSelector } from "react-redux";
import React from "react";
import PropTypes from "prop-types";

import { machine as machineSelectors } from "app/base/selectors";
import DoubleRow from "app/base/components/DoubleRow";
import Tooltip from "app/base/components/Tooltip";

const generateFQDN = (machine, machineURL) => {
  return (
    <a
      href={machineURL}
      onClick={(evt) => {
        evt.preventDefault();
        window.history.pushState(
          null,
          null,
          `${process.env.REACT_APP_BASENAME}${machineURL}`
        );
      }}
      title={machine.fqdn}
    >
      <strong>
        {machine.locked ? (
          <span title="This machine is locked. You have to unlock it to perform any actions.">
            <i className="p-icon--locked">Locked: </i>{" "}
          </span>
        ) : null}
        {machine.hostname}
      </strong>
      <small>.{machine.domain.name}</small>
    </a>
  );
};

const generateIPAddresses = (machine) => {
  let ipAddresses = [];
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
    let ipAddressesLine = (
      <span
        data-test="ip-addresses"
        title={ipAddresses.length === 1 ? ipAddresses[0] : null}
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
      >
        {ipAddressesLine}
      </Tooltip>
    );
  }
  return "";
};

const generateMAC = (machine, machineURL) => {
  return (
    <>
      <a href={machineURL} title={machine.pxe_mac_vendor}>
        {machine.pxe_mac}
      </a>
      {machine.extra_macs && machine.extra_macs.length > 0 ? (
        <a href={machineURL}> (+{machine.extra_macs.length})</a>
      ) : null}
    </>
  );
};

export const NameColumn = ({ handleCheckbox, selected, showMAC, systemId }) => {
  const machine = useSelector((state) =>
    machineSelectors.getBySystemId(state, systemId)
  );
  const machineURL = `${process.env.REACT_APP_ANGULAR_BASENAME}/${machine.link_type}/${machine.system_id}`;
  const primaryRow = showMAC
    ? generateMAC(machine, machineURL)
    : generateFQDN(machine, machineURL);
  const secondaryRow = !showMAC && generateIPAddresses(machine);

  return (
    <DoubleRow
      data-test="name-column"
      primary={
        <Input
          checked={selected}
          className="has-inline-label keep-label-opacity"
          id={systemId}
          label={primaryRow}
          onChange={() => handleCheckbox(machine)}
          type="checkbox"
          wrapperClassName="u-no-margin--bottom machine-list--inline-input"
        />
      }
      primaryTextClassName="u-nudge--checkbox"
      secondary={secondaryRow}
      secondaryClassName="u-nudge--secondary-row"
    />
  );
};

NameColumn.propTypes = {
  handleCheckbox: PropTypes.func,
  selected: PropTypes.bool,
  showMAC: PropTypes.bool,
  systemId: PropTypes.string.isRequired,
};

export default React.memo(NameColumn);
