import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";
import * as Yup from "yup";

import type { SubnetActionProps } from "../../types";

import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";
import LimitedIpInput from "@/app/base/components/LimitedIpInput";
import MacAddressField from "@/app/base/components/MacAddressField";
import { MAC_ADDRESS_REGEX } from "@/app/base/validation";
import type { RootState } from "@/app/store/root/types";
import subnetSelectors from "@/app/store/subnet/selectors";
import {
  getImmutableAndEditableOctets,
  getIpRangeFromCidr,
  isIpInSubnet,
} from "@/app/utils/subnetIpRange";

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

  const onCancel = () => setSidePanelContent(null);

  if (loading) {
    return <Spinner text="Loading..." />;
  }

  if (!subnet) {
    return null;
  }

  const [startIp, endIp] = getIpRangeFromCidr(subnet.cidr);
  const [immutableOctets, _] = getImmutableAndEditableOctets(startIp, endIp);

  const ReserveDHCPLeaseSchema = Yup.object().shape({
    ip_address: Yup.string()
      .required("IP address is required")
      .test({
        name: "ip-is-valid",
        message: "This is not a valid IP address",
        test: (ip_address) => {
          let valid = true;
          const octets = `${ip_address}`.split(".");
          octets.forEach((octet) => {
            // IP address is not valid if the octet is not a number
            if (isNaN(parseInt(octet))) {
              valid = false;
            } else {
              const octetInt = parseInt(octet);
              // Unsigned 8-bit integer cannot be less than 0 or greater than 255
              if (octetInt < 0 || octetInt > 255) {
                valid = false;
              }
            }
          });
          return valid;
        },
      })
      .test({
        name: "ip-is-in-subnet",
        message: "The IP address is outside of the subnet's range.",
        test: (ip_address) =>
          isIpInSubnet(
            `${immutableOctets}.${ip_address}`,
            subnet?.cidr as string
          ),
      }),
    mac_address: Yup.string()
      .required("MAC address is required")
      .matches(MAC_ADDRESS_REGEX, "Invalid MAC address"),
    comment: Yup.string(),
  });

  return (
    <FormikForm<FormValues>
      aria-label="Reserve static DHCP lease"
      initialValues={{
        ip_address: "",
        mac_address: "",
        comment: "",
      }}
      onCancel={onCancel}
      onSubmit={() => {}}
      submitLabel="Reserve static DHCP lease"
      validationSchema={ReserveDHCPLeaseSchema}
    >
      <FormikField
        cidr={subnet.cidr}
        component={LimitedIpInput}
        label="IP address"
        name="ip_address"
        required
      />
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
