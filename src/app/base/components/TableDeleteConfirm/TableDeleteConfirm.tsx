import TableConfirm from "@/app/base/components/TableConfirm";
import type { Props as TableConfirmProps } from "@/app/base/components/TableConfirm/TableConfirm";

type Props = Pick<
  TableConfirmProps,
  "errors" | "onClose" | "onConfirm" | "onSuccess" | "sidebar"
> & {
  readonly deleted: TableConfirmProps["finished"];
  readonly deleting: TableConfirmProps["inProgress"];
  readonly message?: string;
  readonly modelName?: string;
  readonly modelType?: string;
  readonly onClose: TableConfirmProps["onClose"];
  readonly onConfirm: TableConfirmProps["onConfirm"];
  readonly sidebar?: TableConfirmProps["sidebar"];
};

export enum Labels {
  ConfirmLabel = "Delete",
}

const TableDeleteConfirm = ({
  deleted,
  deleting,
  message,
  modelName,
  modelType,
  ...props
}: Props): React.ReactElement => {
  return (
    <TableConfirm
      confirmAppearance="negative"
      confirmLabel={Labels.ConfirmLabel}
      finished={deleted}
      inProgress={deleting}
      message={
        <>
          {message ||
            `Are you sure you want to delete ${modelType} "${modelName}"?`}{" "}
          <span className="u-text--light">
            This action is permanent and can not be undone.
          </span>
        </>
      }
      {...props}
    />
  );
};

export default TableDeleteConfirm;
