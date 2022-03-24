import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import ModelNotFound from "app/base/components/ModelNotFound";
import { useWindowTitle } from "app/base/hooks";
import { useGetURLId } from "app/base/hooks/urls";
import MachineListTable from "app/machines/views/MachineList/MachineListTable";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { RootState } from "app/store/root/types";
import { actions as tagActions } from "app/store/tag";
import tagSelectors from "app/store/tag/selectors";
import { TagMeta } from "app/store/tag/types";
import tagURLs from "app/tags/urls";
import { isId } from "app/utils";

export enum Label {
  Machines = "Deployed machines",
}

const TagMachines = (): JSX.Element => {
  const dispatch = useDispatch();
  const id = useGetURLId(TagMeta.PK);
  const tag = useSelector((state: RootState) =>
    tagSelectors.getById(state, id)
  );
  const tagsLoading = useSelector(tagSelectors.loading);
  const deployedMachines = useSelector((state: RootState) =>
    machineSelectors.getDeployedWithTag(state, id)
  );

  useWindowTitle(tag ? `Deployed machines for: ${tag.name}` : "Tag");

  useEffect(() => {
    dispatch(tagActions.fetch());
    dispatch(machineActions.fetch());
  }, [dispatch]);

  if (!isId(id) || (!tagsLoading && !tag)) {
    return (
      <ModelNotFound id={id} linkURL={tagURLs.tags.index} modelName="tag" />
    );
  }

  if (!tag || tagsLoading) {
    return <Spinner data-testid="Spinner" />;
  }

  return (
    <MachineListTable
      aria-label={Label.Machines}
      machines={deployedMachines}
      showActions={false}
    />
  );
};

export default TagMachines;
