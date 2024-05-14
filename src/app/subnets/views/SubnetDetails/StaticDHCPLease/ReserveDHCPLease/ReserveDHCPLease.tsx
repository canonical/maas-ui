import { useCallback } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import type { SubnetActionProps } from "../../types";

import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";
import MacAddressField from "@/app/base/components/MacAddressField";
import PrefixedIpInput from "@/app/base/components/PrefixedIpInput";
import { MAC_ADDRESS_REGEX } from "@/app/base/validation";
import { reservedIpActions } from "@/app/store/reservedip";
import reservedIpSelectors from "@/app/store/reservedip/selectors";
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
  const subnetLoading = useSelector(subnetSelectors.loading);
  const reservedIpLoading = useSelector(reservedIpSelectors.loading);
  const errors = useSelector(reservedIpSelectors.errors);
  const saving = useSelector(reservedIpSelectors.saving);
  const saved = useSelector(reservedIpSelectors.saved);

  const loading = subnetLoading || reservedIpLoading;

  const dispatch = useDispatch();
  const cleanup = useCallback(() => reservedIpActions.cleanup(), []);

  const onClose = () => setSidePanelContent(null);

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
    mac_address: Yup.string().matches(MAC_ADDRESS_REGEX, "Invalid MAC address"),
    comment: Yup.string(),
  });

  const handleSubmit = (values: FormValues) => {
    dispatch(cleanup());

    dispatch(
      reservedIpActions.create({
        comment: values.comment,
        ip: `${immutableOctets}.${values.ip_address}`,
        mac_address: values.mac_address,
        subnet: subnetId,
      })
    );
  };

  return (
    <FormikForm<FormValues>
      aria-label="Reserve static DHCP lease"
      cleanup={cleanup}
      errors={errors}
      initialValues={{
        ip_address: "",
        mac_address: "",
        comment: "",
      }}
      onCancel={onClose}
      onSubmit={handleSubmit}
      onSuccess={onClose}
      resetOnSave
      saved={saved}
      saving={saving}
      submitLabel="Reserve static DHCP lease"
      validationSchema={ReserveDHCPLeaseSchema}
    >
      <FormikField
        cidr={subnet.cidr}
        component={PrefixedIpInput}
        label="IP address"
        name="ip_address"
        required
      />
      <MacAddressField label="MAC address" name="mac_address" />
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
