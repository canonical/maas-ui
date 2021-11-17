import { useEffect, useState } from "react";

import { Button, Col, Input, Row } from "@canonical/react-components";
import { useFormikContext } from "formik";

import type { AddMachineValues } from "../types";

import ArchitectureSelect from "app/base/components/ArchitectureSelect";
import DomainSelect from "app/base/components/DomainSelect";
import FormikField from "app/base/components/FormikField";
import MacAddressField from "app/base/components/MacAddressField";
import MinimumKernelSelect from "app/base/components/MinimumKernelSelect";
import PowerTypeFields from "app/base/components/PowerTypeFields";
import ResourcePoolSelect from "app/base/components/ResourcePoolSelect";
import ZoneSelect from "app/base/components/ZoneSelect";
import { PowerTypeNames } from "app/store/general/constants";
import type { MachineState } from "app/store/machine/types";
import { formatMacAddress } from "app/utils";

type Props = {
  saved: MachineState["saved"];
};

export const AddMachineFormFields = ({ saved }: Props): JSX.Element => {
  const [extraMACs, setExtraMACs] = useState<string[]>([]);

  const formikProps = useFormikContext<AddMachineValues>();
  const { errors, setFieldValue, values } = formikProps;

  useEffect(() => {
    if (saved) {
      setExtraMACs([]);
    }
  }, [saved]);

  const macAddressRequired = values.power_type !== PowerTypeNames.IPMI;

  return (
    <Row>
      <Col size={5}>
        <FormikField
          label="Machine name"
          name="hostname"
          placeholder="Machine name (optional)"
          type="text"
        />
        <DomainSelect name="domain" required />
        <ArchitectureSelect name="architecture" required />
        <MinimumKernelSelect name="min_hwe_kernel" />
        <ZoneSelect name="zone" required />
        <ResourcePoolSelect name="pool" required />
        <MacAddressField
          label="MAC address"
          name="pxe_mac"
          required={macAddressRequired}
        />
        {extraMACs.map((mac, i) => (
          <div
            className="p-input--closeable"
            data-testid={`extra-macs-${i}`}
            key={`extra-macs-${i}`}
          >
            <Input
              error={errors?.extra_macs && errors.extra_macs[i]}
              maxLength={17}
              onChange={(e) => {
                const newExtraMACs = [...extraMACs];
                newExtraMACs[i] = formatMacAddress(e.target.value);
                setExtraMACs(newExtraMACs);
                setFieldValue("extra_macs", newExtraMACs);
              }}
              placeholder="00:00:00:00:00:00"
              type="text"
              value={mac}
            />
            <Button
              className="p-close-input"
              hasIcon
              onClick={() => {
                const newExtraMACs = extraMACs.filter((_, j) => j !== i);
                setExtraMACs(newExtraMACs);
                setFieldValue("extra_macs", newExtraMACs);
              }}
              type="button"
            >
              <i className="p-icon--close" />
            </Button>
          </div>
        ))}
        <div className="u-align--right">
          <Button
            data-testid="add-extra-mac"
            hasIcon
            onClick={() => setExtraMACs([...extraMACs, ""])}
            type="button"
          >
            <i className="p-icon--plus" />
            <span>Add MAC address</span>
          </Button>
        </div>
      </Col>
      <Col emptyLarge={7} size={5}>
        <PowerTypeFields />
      </Col>
    </Row>
  );
};

export default AddMachineFormFields;
