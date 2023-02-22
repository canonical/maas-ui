import { Select } from "@canonical/react-components";

type Props = {
  pageSize: number;
  setPageSize: (pageSize: number) => void;
};

export enum Labels {
  ItemsPerPage = "Items per page",
  Fifty = "50/page",
  OneHundred = "100/page",
  TwoHundred = "200/page",
}

const groupOptions = [
  {
    value: 50,
    label: Labels.Fifty,
  },
  {
    value: 100,
    label: Labels.OneHundred,
  },
  {
    value: 200,
    label: Labels.TwoHundred,
  },
];

const PageSizeSelect = ({ pageSize, setPageSize }: Props): JSX.Element => {
  return (
    <Select
      aria-label={Labels.ItemsPerPage}
      defaultValue={pageSize}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(parseInt(e.target.value));
      }}
      options={groupOptions}
    />
  );
};

export default PageSizeSelect;
