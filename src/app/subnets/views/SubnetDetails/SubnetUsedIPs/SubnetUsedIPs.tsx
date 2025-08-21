import type { ReactElement } from "react";

import { GenericTable } from "@canonical/maas-react-components";
import { useSelector } from "react-redux";

import TitledSection from "@/app/base/components/TitledSection";
import usePagination from "@/app/base/hooks/usePagination/usePagination";
import type { RootState } from "@/app/store/root/types";
import subnetSelectors from "@/app/store/subnet/selectors";
import type { Subnet, SubnetIP, SubnetMeta } from "@/app/store/subnet/types";
import { isSubnetDetails } from "@/app/store/subnet/utils";
import useSubnetUsedIPsColumns from "@/app/subnets/views/SubnetDetails/SubnetUsedIPs/useSubnetUsedIPsColumns/useSubnetUsedIPsColumns";

export type Props = {
  subnetId: Subnet[SubnetMeta.PK] | null;
};

export enum Labels {
  IpAddresses = "IP addresses",
  Type = "Type",
  Node = "Node",
  Interface = "interface",
  Usage = "Usage",
  Owner = "Owner",
}

export type SubnetUsedIP = SubnetIP & { id: number };

const SubnetUsedIPs = ({ subnetId }: Props): ReactElement => {
  const subnet = useSelector((state: RootState) =>
    subnetSelectors.getById(state, subnetId)
  );
  const loading = useSelector(subnetSelectors.loading);

  const allSubnetIPs: SubnetUsedIP[] = !isSubnetDetails(subnet)
    ? []
    : subnet.ip_addresses.map((ip, index) => ({ id: index, ...ip }));

  const { page, size, handlePageSizeChange, setPage } = usePagination();
  const columns = useSubnetUsedIPsColumns();

  return (
    <TitledSection
      className="u-no-padding--top u-no-padding--bottom"
      title="Used IP addresses"
    >
      <GenericTable
        className="used-ip-table"
        columns={columns}
        data={allSubnetIPs.slice(size * (page - 1), size * page)}
        isLoading={loading}
        noData={"No IP addresses for this subnet."}
        pagination={{
          currentPage: page,
          dataContext: "IP addresses",
          handlePageSizeChange: handlePageSizeChange,
          isPending: loading,
          itemsPerPage: size,
          setCurrentPage: setPage,
          totalItems: allSubnetIPs.length,
        }}
        sortBy={[{ id: "ip", desc: false }]}
      />
    </TitledSection>
  );
};

export default SubnetUsedIPs;
