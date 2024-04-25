import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";
import * as Yup from "yup";

import type { SubnetActionProps } from "../../types";

import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";
import MacAddressField from "@/app/base/components/MacAddressField";
import type { RootState } from "@/app/store/root/types";
import subnetSelectors from "@/app/store/subnet/selectors";
import { isIpInSubnet } from "@/app/utils/subnetIpRange";

type Props = Pick<SubnetActionProps, "subnetId" | "setSidePanelContent">;

type FormValues = {
  ip_address: string;
  mac_address: string;
  comment: string;
};

const ReserveDHCPLease = ({ subnetId, setSidePanelContent }: Props) => {
  const subnet = useSelector((state: RootState) =>
    subnetSelectors.getById(state, subnetId)
  );
  const loading = useSelector(subnetSelectors.loading);

  const onCancel = () => {
    setSidePanelContent(null);
  };

  const ReserveDHCPLeaseSchema = Yup.object().shape({
    ip_address: Yup.string()
      .required("IP address is required")
      .test({
        name: "is-valid-ip",
        message: "Invalid IP address",
        test: (ip_address) =>
          isIpInSubnet(ip_address as string, subnet?.cidr as string),
      }),
    mac_address: Yup.string().required("MAC address is required"),
    comment: Yup.string(),
  });

  if (loading) {
    return <Spinner text="Loading..." />;
  }

  if (!subnet) {
    return <div>uh oh</div>;
  }

  const subnetMask = subnet.cidr.split("/")[0].slice(0, -1);

  return (
    <FormikForm<FormValues>
      aria-label="Reserve static DHCP lease"
      initialValues={{
        ip_address: subnetMask,
        mac_address: "",
        comment: "",
      }}
      onCancel={onCancel}
      onSubmit={() => {}}
      submitLabel="Reserve static DHCP lease"
      validationSchema={ReserveDHCPLeaseSchema}
    >
      <FormikField label="IP address" name="ip_address" required type="text" />
      <MacAddressField label="MAC address" name="mac_address" required />
      <FormikField
        label="Comment"
        name="comment"
        placeholder="Static DHCP lease purpose"
        type="text"
      />
    </FormikForm>
  );
};

export default ReserveDHCPLease;
