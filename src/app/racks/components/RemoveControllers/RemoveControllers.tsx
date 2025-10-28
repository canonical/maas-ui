import { useMemo, useState } from "react";

import { GenericTable } from "@canonical/maas-react-components";
import type { RowSelectionState } from "@tanstack/react-table";
import pluralize from "pluralize";

import { useGetRack } from "@/app/api/query/racks";
import FormikForm from "@/app/base/components/FormikForm";
import { useSidePanel } from "@/app/base/side-panel-context-new";

import "./_index.scss";

type RemoveControllersProps = {
  id: number;
};

const RemoveControllers = ({ id }: RemoveControllersProps) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const { closeSidePanel } = useSidePanel();
  const rack = useGetRack({ path: { rack_id: id } });
  const column = useMemo(
    () => [
      {
        id: "name",
        accessorKey: "name",
        enableSorting: true,
        header: "CONTROLLER",
      },
    ],
    []
  );
  const fakeControllers = useMemo(() => {
    if (rack.data) {
      return [
        { id: rack.data.id, name: `controller-${rack.data.id}` },
        { id: rack.data.id + 1, name: `controller-${rack.data.id + 1}` },
        { id: rack.data.id + 2, name: `controller-${rack.data.id + 2}` },
      ];
    } else {
      return rack.data;
    }
  }, [rack.data]);
  return (
    <FormikForm
      className="remove-controllers"
      initialValues={rowSelection}
      onCancel={closeSidePanel}
      onSubmit={() => {}}
      submitAppearance="negative"
      submitLabel={`Remove ${Object.values(rowSelection).length} ${pluralize("controller", Object.values(rowSelection).length)}`}
    >
      Are you sure you want to remove controller from this rack? You will have
      to re-register the controllers to revert this action.
      {fakeControllers && (
        <GenericTable
          canSelect
          className="u-border u-margin-top--medium"
          columns={column}
          data={fakeControllers}
          isLoading={rack.isPending}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        ></GenericTable>
      )}
    </FormikForm>
  );
};

export default RemoveControllers;
