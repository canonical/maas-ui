import { Col, Row } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import type { CredentialsFormValues } from "../../types";

import CertificateFields from "app/base/components/CertificateFields";
import FormikField from "app/base/components/FormikField";
import ResourcePoolSelect from "app/base/components/ResourcePoolSelect";
import ZoneSelect from "app/base/components/ZoneSelect";
import type { SetKvmType } from "app/kvm/components/KVMHeaderForms/AddKVM";
import KvmTypeSelect from "app/kvm/components/KVMHeaderForms/AddKVM/KvmTypeSelect";
import { PodType } from "app/store/pod/constants";
import podSelectors from "app/store/pod/selectors";

type Props = {
  setKvmType: SetKvmType;
  setShouldGenerateCert: (generateCert: boolean) => void;
  shouldGenerateCert: boolean;
};

export const CredentialsFormFields = ({
  setKvmType,
  setShouldGenerateCert,
  shouldGenerateCert,
}: Props): JSX.Element => {
  const lxdAddresses = useSelector(podSelectors.groupByLxdServer).map(
    (group) => group.address
  );
  const { setFieldValue } = useFormikContext<CredentialsFormValues>();

  return (
    <Row>
      <Col size={6}>
        <KvmTypeSelect kvmType={PodType.LXD} setKvmType={setKvmType} />
      </Col>
      <Col size={6}>
        <FormikField label="Name" name="name" required type="text" />
        <ZoneSelect name="zone" required valueKey="id" />
        <ResourcePoolSelect name="pool" required valueKey="id" />
        <FormikField
          autoComplete="off"
          label="LXD address"
          list="lxd-addresses"
          name="power_address"
          required
          type="text"
        />
        <datalist id="lxd-addresses">
          {lxdAddresses.map((address) => (
            <option key={address} value={address}>
              {address}
            </option>
          ))}
        </datalist>
        <CertificateFields
          onShouldGenerateCert={(shouldGenerateCert) => {
            setShouldGenerateCert(shouldGenerateCert);
            setFieldValue("certificate", "");
            setFieldValue("key", "");
          }}
          shouldGenerateCert={shouldGenerateCert}
        />
      </Col>
    </Row>
  );
};

export default CredentialsFormFields;
