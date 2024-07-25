import { useCallback } from "react";

import { Col, Row, Spinner } from "@canonical/react-components";
import * as ipaddr from "ipaddr.js";
import { isIP, isIPv4 } from "is-ip";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";
import PrefixedIpInput, {
  formatIpAddress,
} from "@/app/base/components/PrefixedIpInput";
import {
  useSidePanel,
  type SetSidePanelContent,
} from "@/app/base/side-panel-context";
import { ipRangeActions } from "@/app/store/iprange";
import ipRangeSelectors from "@/app/store/iprange/selectors";
import type { IPRange } from "@/app/store/iprange/types";
import { IPRangeType, IPRangeMeta } from "@/app/store/iprange/types";
import type { RootState } from "@/app/store/root/types";
import subnetSelectors from "@/app/store/subnet/selectors";
import type { Subnet, SubnetMeta } from "@/app/store/subnet/types";
import { isId } from "@/app/utils";
import {
  getImmutableAndEditableOctets,
  getIpRangeFromCidr,
  isIpInSubnet,
} from "@/app/utils/subnetIpRange";

type Props = {
  createType?: IPRangeType;
  ipRangeId?: IPRange[IPRangeMeta.PK] | null;
  setSidePanelContent: SetSidePanelContent;
  subnetId?: Subnet[SubnetMeta.PK] | null;
};

export type FormValues = {
  comment: IPRange["comment"];
  end_ip: IPRange["end_ip"];
  start_ip: IPRange["start_ip"];
};

export enum Labels {
  CreateRange = "Create reserved range",
  EditRange = "Edit reserved range",
  EndIp = "End IP address",
  Comment = "Purpose",
  StartIp = "Start IP address",
}

const ReservedRangeForm = ({
  createType,
  ipRangeId,
  setSidePanelContent,
  subnetId,
  ...props
}: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const { sidePanelContent } = useSidePanel();
  let computedIpRangeId = ipRangeId;
  if (!ipRangeId) {
    computedIpRangeId =
      sidePanelContent?.extras && "ipRangeId" in sidePanelContent.extras
        ? sidePanelContent?.extras?.ipRangeId
        : undefined;
  }
  const ipRange = useSelector((state: RootState) =>
    ipRangeSelectors.getById(state, computedIpRangeId)
  );
  const saved = useSelector(ipRangeSelectors.saved);
  const saving = useSelector(ipRangeSelectors.saving);
  const errors = useSelector(ipRangeSelectors.errors);
  const subnet = useSelector((state: RootState) =>
    subnetSelectors.getById(state, subnetId)
  );
  const subnetLoading = useSelector(subnetSelectors.loading);

  const cleanup = useCallback(() => ipRangeActions.cleanup(), []);

  const isEditing = isId(computedIpRangeId);
  const showDynamicComment = isEditing && ipRange?.type === IPRangeType.Dynamic;
  const onClose = () => setSidePanelContent(null);
  let computedCreateType = createType;
  if (!createType) {
    computedCreateType =
      sidePanelContent?.extras && "createType" in sidePanelContent.extras
        ? sidePanelContent?.extras?.createType
        : undefined;
  }

  if ((isEditing && !ipRange) || subnetLoading) {
    return (
      <span data-testid="Spinner">
        <Spinner text="Loading..." />
      </span>
    );
  }

  if (!subnet) {
    return null;
  }

  const [startIp, endIp] = getIpRangeFromCidr(subnet.cidr);
  const [immutableOctets, _] = getImmutableAndEditableOctets(startIp, endIp);
  const networkAddress = subnet.cidr.split("/")[0];
  const prefixLength = parseInt(subnet.cidr.split("/")[1]);
  const subnetIsIpv4 = isIPv4(networkAddress);

  const ReservedRangeSchema = Yup.object().shape({
    comment: Yup.string(),
    start_ip: Yup.string()
      .required("Start IP is required")
      .test({
        name: "ip-is-valid",
        message: "This is not a valid IP address",
        test: (ip_address) => isIP(formatIpAddress(ip_address, subnet.cidr)),
      })
      .test({
        name: "ip-is-in-subnet",
        message: "The IP address is outside of the subnet's range.",
        test: (ip_address) => {
          const ip = formatIpAddress(ip_address, subnet.cidr);
          if (subnetIsIpv4) {
            return isIpInSubnet(ip, subnet.cidr as string);
          } else {
            try {
              const addr = ipaddr.parse(ip);
              const netAddr = ipaddr.parse(networkAddress);
              return addr.match(netAddr, prefixLength);
            } catch (e) {
              return false;
            }
          }
        },
      }),
    end_ip: Yup.string()
      .required("End IP is required")
      .test({
        name: "ip-is-valid",
        message: "This is not a valid IP address",
        test: (ip_address) => isIP(formatIpAddress(ip_address, subnet.cidr)),
      })
      .test({
        name: "ip-is-in-subnet",
        message: "The IP address is outside of the subnet's range.",
        test: (ip_address) => {
          const ip = formatIpAddress(ip_address, subnet.cidr);
          if (subnetIsIpv4) {
            return isIpInSubnet(ip, subnet.cidr as string);
          } else {
            try {
              const addr = ipaddr.parse(ip);
              const netAddr = ipaddr.parse(networkAddress);
              return addr.match(netAddr, prefixLength);
            } catch (e) {
              return false;
            }
          }
        },
      }),
  });

  const getInitialValues = () => {
    let initialComment = "";
    if (showDynamicComment) {
      initialComment = "Dynamic";
    } else if (isEditing) {
      initialComment = ipRange?.comment ?? "";
    }

    let startIp = "";
    let endIp = "";

    if (isEditing && ipRange) {
      startIp = subnetIsIpv4
        ? ipRange?.start_ip.replace(`${immutableOctets}.`, "")
        : ipRange?.start_ip.replace(`${networkAddress}`, "");
      endIp = subnetIsIpv4
        ? ipRange?.end_ip.replace(`${immutableOctets}.`, "")
        : ipRange?.end_ip.replace(`${networkAddress}`, "");
    }

    return {
      comment: initialComment,
      end_ip: endIp,
      start_ip: startIp,
    };
  };

  return (
    <FormikForm<FormValues>
      aria-label={isEditing ? Labels.EditRange : Labels.CreateRange}
      cleanup={cleanup}
      errors={errors}
      initialValues={getInitialValues()}
      onCancel={onClose}
      onSaveAnalytics={{
        action: "Save reserved range",
        category: "Reserved ranges table",
        label: `${isEditing ? "Edit" : "Create"} reserved range form`,
      }}
      onSubmit={(values) => {
        // Clear the errors from the previous submission.
        const startIp = formatIpAddress(values.start_ip, subnet.cidr);
        const endIp = formatIpAddress(values.end_ip, subnet.cidr);
        dispatch(cleanup());
        if (!isEditing && computedCreateType) {
          dispatch(
            ipRangeActions.create({
              subnet: subnetId,
              type: computedCreateType,
              start_ip: startIp,
              end_ip: endIp,
              comment: values.comment,
            })
          );
        } else if (isEditing && ipRange) {
          dispatch(
            ipRangeActions.update({
              [IPRangeMeta.PK]: ipRange[IPRangeMeta.PK],
              start_ip: startIp,
              end_ip: endIp,
              // Reset the value of the comment field so that "Dynamic" isn't stored.
              comment: showDynamicComment ? ipRange?.comment : values.comment,
            })
          );
        }
      }}
      onSuccess={() => onClose()}
      resetOnSave
      saved={saved}
      saving={saving}
      submitLabel={isEditing ? "Save" : "Reserve"}
      validationSchema={ReservedRangeSchema}
      {...props}
    >
      <Row>
        <Col size={12}>
          <FormikField
            cidr={subnet.cidr}
            component={PrefixedIpInput}
            label={Labels.StartIp}
            name="start_ip"
            required
          />
        </Col>
        <Col size={12}>
          <FormikField
            cidr={subnet.cidr}
            component={PrefixedIpInput}
            label={Labels.EndIp}
            name="end_ip"
            required
          />
        </Col>
        {isEditing || computedCreateType === IPRangeType.Reserved ? (
          <Col size={12}>
            <FormikField
              disabled={showDynamicComment}
              label={Labels.Comment}
              name="comment"
              placeholder="IP range purpose (optional)"
              type="text"
            />
          </Col>
        ) : null}
      </Row>
    </FormikForm>
  );
};

export default ReservedRangeForm;
