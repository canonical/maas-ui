import { GenericTable } from "@canonical/maas-react-components";

import useHardeningStatusTableColumns from "./useHardeningStatusTableColumns";

import type { HardeningRequirement } from "@/app/settings/views/Security/HardeningStatus/utils";

import "./_index.scss";

type Props = {
  requirements: HardeningRequirement[];
  isLoading: boolean;
};

const HardeningStatusTable = ({
  requirements,
  isLoading,
}: Props): React.ReactElement => {
  const columns = useHardeningStatusTableColumns();

  return (
    <GenericTable
      aria-label="Hardening status"
      className="hardening-status-table"
      columns={columns}
      data={requirements}
      isLoading={isLoading}
      noData="All hardening requirements are met."
      variant="regular"
    />
  );
};

export default HardeningStatusTable;
