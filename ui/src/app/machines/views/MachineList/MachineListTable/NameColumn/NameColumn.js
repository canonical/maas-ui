import { Tooltip } from "@canonical/react-components";
import { Input } from "@canonical/react-components";
import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";

import { generateLegacyURL } from "app/utils";
import machineSelectors from "app/store/machine/selectors";
import DoubleRow from "app/base/components/DoubleRow";

const generateFQDN = (machine, machineURL) => {
  return (
    <a
      href={machineURL}
      onClick={(evt) => {
        evt.preventDefault();
        window.history.pushState(null, null, machineURL);
      }}
      title={machine.fqdn}
    >
      <strong data-test="hostname">
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
      <a
        href={machineURL}
        onClick={(evt) => {
          evt.preventDefault();
          window.history.pushState(null, null, machineURL);
        }}
        title={machine.pxe_mac_vendor}
      >
        {machine.pxe_mac}
      </a>
      {machine.extra_macs && machine.extra_macs.length > 0 ? (
        <a
          href={machineURL}
          onClick={(evt) => {
            evt.preventDefault();
            window.history.pushState(null, null, machineURL);
          }}
        >
          {" "}
          (+{machine.extra_macs.length})
        </a>
      ) : null}
    </>
  );
};

export const NameColumn = ({ handleCheckbox, selected, showMAC, systemId }) => {
  const machine = useSelector((state) =>
    machineSelectors.getById(state, systemId)
  );
  const machineURL = generateLegacyURL(
    `/${machine.link_type}/${machine.system_id}`
  );
  const primaryRow = showMAC
    ? generateMAC(machine, machineURL)
    : generateFQDN(machine, machineURL);
  const secondaryRow = !showMAC && generateIPAddresses(machine);

  return (
    <DoubleRow
      data-test="name-column"
      primary={
        handleCheckbox ? (
          <Input
            checked={selected}
            className="has-inline-label keep-label-opacity"
            id={systemId}
            label={primaryRow}
            onChange={handleCheckbox}
            type="checkbox"
            wrapperClassName="u-no-margin--bottom machine-list--inline-input"
          />
        ) : (
          primaryRow
        )
      }
      primaryTextClassName={handleCheckbox && "u-nudge--checkbox"}
      secondary={secondaryRow}
      secondaryClassName={handleCheckbox && "u-nudge--secondary-row"}
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
