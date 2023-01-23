import type {
  PaginationProps,
  PropsWithSpread,
} from "@canonical/react-components";
import { Col, Row, Select, Pagination } from "@canonical/react-components";

import { useFetchedCount } from "app/store/machine/utils";

export enum Label {
  Pagination = "Table pagination",
}

type Props = PropsWithSpread<
  {
    currentPage: PaginationProps["currentPage"];
    pageSize: PaginationProps["itemsPerPage"];
    setPageSize: (pageSize: number) => void;
    machineCount: number | null;
    machinesLoading?: boolean | null;
    paginate: PaginationProps["paginate"];
  },
  Partial<PaginationProps>
>;

const MachineListPagination = ({
  machineCount,
  machinesLoading,
  pageSize,
  setPageSize,
  ...props
}: Props): JSX.Element | null => {
  const count = useFetchedCount(machineCount, machinesLoading);
  return count > 0 ? (
    <div className="u-flex u-nudge-down">
      <Row>
        <Col size={6}>
          <Select
            label="Items per page"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setPageSize(Number(e.target.value));
            }}
            options={["10", "20", "50", "100"].map((item) => ({
              label: item,
              value: item,
              selected: pageSize.toString() === item,
            }))}
            value={`${pageSize}`}
            wrapperClassName="p-form--inline"
          />
        </Col>
        <Col size={6}>
          <Pagination
            aria-label={Label.Pagination}
            className="u-flex--end"
            itemsPerPage={pageSize}
            totalItems={count}
            {...props}
          />
        </Col>
      </Row>
    </div>
  ) : null;
};

export default MachineListPagination;
