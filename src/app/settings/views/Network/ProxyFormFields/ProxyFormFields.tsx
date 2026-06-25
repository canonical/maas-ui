import { useFormikContext } from "formik";

import type { ProxyFormValues } from "../ProxyForm/types";

import FormikField from "@/app/base/components/FormikField";

const ProxyFormFields = ({
  canEdit,
}: {
  canEdit: boolean;
}): React.ReactElement => {
  const { values } = useFormikContext<ProxyFormValues>();

  return (
    <>
      <p>
        HTTP proxy used by MAAS to download images, and by provisioned machines
        for APT and YUM packages.
      </p>
      <FormikField
        disabled={!canEdit}
        label="Don't use a proxy"
        name="proxyType"
        type="radio"
        value="noProxy"
      />
      <FormikField
        disabled={!canEdit}
        label="MAAS built-in"
        name="proxyType"
        type="radio"
        value="builtInProxy"
      />
      <FormikField
        disabled={!canEdit}
        label="External"
        name="proxyType"
        type="radio"
        value="externalProxy"
      />
      {values.proxyType === "externalProxy" && (
        <FormikField
          disabled={!canEdit}
          help="Enter the external proxy URL MAAS will use to download images and machines to download APT packages."
          name="httpProxy"
          required={true}
          type="text"
        />
      )}
      <FormikField
        disabled={!canEdit}
        label="Peer"
        name="proxyType"
        type="radio"
        value="peerProxy"
      />
      {values.proxyType === "peerProxy" && (
        <FormikField
          disabled={!canEdit}
          help="Enter the external proxy URL that the MAAS built-in proxy will use as an upstream cache peer. Machines will be configured to use MAAS' built-in proxy to download APT packages."
          name="httpProxy"
          required={true}
          type="text"
        />
      )}
    </>
  );
};

export default ProxyFormFields;
