import type { ChangeEventHandler } from "react";
import { useEffect } from "react";

import { MainTable } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useDispatch, useSelector } from "react-redux";

import type { ConfigureDHCPValues } from "../ConfigureDHCP";

import FormikField from "app/base/components/FormikField";
import SubnetLink from "app/base/components/SubnetLink";
import SubnetSelect from "app/base/components/SubnetSelect";
import TitledSection from "app/base/components/TitledSection";
import { actions as ipRangeActions } from "app/store/iprange";
import ipRangeSelectors from "app/store/iprange/selectors";
import type { IPRange } from "app/store/iprange/types";
import { getCommentDisplay } from "app/store/iprange/utils";
import type { RootState } from "app/store/root/types";
import { actions as subnetActions } from "app/store/subnet";
import subnetSelectors from "app/store/subnet/selectors";
import type { Subnet } from "app/store/subnet/types";
import type { VLAN, VLANMeta } from "app/store/vlan/types";
import { isId } from "app/utils";

type Props = {
  id: VLAN[VLANMeta.PK];
};

export enum Headers {
  Comment = "Comment",
  EndIP = "End IP address",
  GatewayIP = "Gateway IP",
  StartIP = "Start IP address",
  Subnet = "Subnet",
}

const generateIPRangeRows = (ipRanges: IPRange[], subnets: Subnet[]) =>
  ipRanges.map((ipRange) => {
    const subnet = subnets.find((subnet) => subnet.id === ipRange.subnet);
    const comment = getCommentDisplay(ipRange);
    const gatewayIP = subnet?.gateway_ip || "—";

    return {
      columns: [
        {
          "aria-label": Headers.Subnet,
          content: <SubnetLink id={ipRange.subnet} />,
        },
        {
          "aria-label": Headers.StartIP,
          content: ipRange.start_ip,
        },
        {
          "aria-label": Headers.EndIP,
          content: ipRange.end_ip,
        },
        {
          "aria-label": Headers.GatewayIP,
          content: gatewayIP,
        },
        {
          "aria-label": Headers.Comment,
          content: comment,
        },
      ],
      key: ipRange.id,
      sortData: {
        comment,
        endIP: ipRange.end_ip,
        gatewayIP,
        subnet: subnet?.cidr || "",
        startIP: ipRange.start_ip,
      },
    };
  });

const generateFormRow = (
  vlanId: VLAN[VLANMeta.PK],
  subnetSelected: boolean,
  handleSubnetChange: ChangeEventHandler
) => {
  return [
    {
      columns: [
        {
          "aria-label": Headers.Subnet,
          content: (
            <SubnetSelect
              labelClassName="u-visually-hidden"
              name="subnet"
              onChange={handleSubnetChange}
              vlan={vlanId}
            />
          ),
        },
        {
          "aria-label": Headers.StartIP,
          content: subnetSelected ? (
            <FormikField
              label={Headers.StartIP}
              labelClassName="u-visually-hidden"
              name="startIP"
              type="text"
            />
          ) : null,
        },
        {
          "aria-label": Headers.EndIP,
          content: subnetSelected ? (
            <FormikField
              label={Headers.EndIP}
              labelClassName="u-visually-hidden"
              name="endIP"
              type="text"
            />
          ) : null,
        },
        {
          "aria-label": Headers.GatewayIP,
          content: subnetSelected ? (
            <FormikField
              label={Headers.GatewayIP}
              labelClassName="u-visually-hidden"
              name="gatewayIP"
              type="text"
            />
          ) : null,
        },
      ],
    },
  ];
};

const DHCPReservedRanges = ({ id }: Props): JSX.Element | null => {
  const { handleChange, setFieldValue, values } =
    useFormikContext<ConfigureDHCPValues>();
  const dispatch = useDispatch();
  const ipRanges = useSelector((state: RootState) =>
    ipRangeSelectors.getByVLAN(state, id)
  );
  const subnets = useSelector(subnetSelectors.all);

  useEffect(() => {
    dispatch(ipRangeActions.fetch());
    dispatch(subnetActions.fetch());
  }, [dispatch]);

  if (!values.enableDHCP) {
    return null;
  }

  // If the VLAN already has IP ranges defined in its subnets we only display
  // a table of that IP range data. Otherwise, we allow the user to define a
  // range of IP addresses to be used for DHCP.
  const hasIPRanges = ipRanges.length > 0;
  const subnetSelected = isId(values.subnet);
  const handleSubnetChange: ChangeEventHandler<HTMLSelectElement> = async (
    e
  ) => {
    await handleChange(e);
    // We set reserved range defaults based on the selected subnet if they exist
    // otherwise leave the field empty.
    const subnet = subnets.find(
      (subnet) => Number(e.target.value) === subnet.id
    );
    setFieldValue(
      "endIP",
      subnet?.statistics.suggested_dynamic_range?.end || ""
    );
    setFieldValue(
      "gatewayIP",
      subnet?.gateway_ip || subnet?.statistics.suggested_gateway || ""
    );
    setFieldValue(
      "startIP",
      subnet?.statistics.suggested_dynamic_range?.start || ""
    );
  };

  return (
    <TitledSection title="Reserved dynamic range">
      {hasIPRanges ? (
        <MainTable
          defaultSort="startIP"
          defaultSortDirection="ascending"
          headers={[
            { content: Headers.Subnet, sortKey: "subnet" },
            { content: Headers.StartIP, sortKey: "startIP" },
            { content: Headers.EndIP, sortKey: "endIP" },
            { content: Headers.GatewayIP, sortKey: "gatewayIP" },
            { content: Headers.Comment, sortKey: "comment" },
          ]}
          responsive
          rows={generateIPRangeRows(ipRanges, subnets)}
          sortable
        />
      ) : (
        <MainTable
          headers={[
            { content: Headers.Subnet },
            { content: Headers.StartIP },
            { content: Headers.EndIP },
            { content: Headers.GatewayIP },
          ]}
          responsive
          rows={generateFormRow(id, subnetSelected, handleSubnetChange)}
        />
      )}
    </TitledSection>
  );
};

export default DHCPReservedRanges;
