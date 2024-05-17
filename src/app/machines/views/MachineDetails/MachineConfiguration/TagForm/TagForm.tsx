import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import EditableSection from "@/app/base/components/EditableSection";
import TagLinks from "@/app/base/components/TagLinks";
import { useFetchActions, useCanEdit } from "@/app/base/hooks";
import urls from "@/app/base/urls";
import TagActionForm from "@/app/machines/components/MachineForms/MachineActionFormWrapper/TagForm";
import machineSelectors from "@/app/store/machine/selectors";
import type { MachineDetails } from "@/app/store/machine/types";
import { FilterMachines } from "@/app/store/machine/utils";
import type { RootState } from "@/app/store/root/types";
import { tagActions } from "@/app/store/tag";
import tagSelectors from "@/app/store/tag/selectors";
import { NodeActions } from "@/app/store/types/node";

type Props = { systemId: MachineDetails["system_id"] };

const TagForm = ({ systemId }: Props): JSX.Element | null => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const tags = useSelector((state: RootState) =>
    tagSelectors.getByIDs(state, machine?.tags || null)
  );
  const tagsLoading = useSelector(tagSelectors.loading);
  const taggingMachines = useSelector(machineSelectors.updatingTags);
  const tagEvents = [NodeActions.TAG, NodeActions.UNTAG];
  const errors = useSelector((state: RootState) =>
    machineSelectors.eventErrorsForIds(state, systemId, tagEvents)
  )[0]?.error;
  const canEdit = useCanEdit(machine, true);

  useFetchActions([tagActions.fetch]);

  if (!machine || tagsLoading) {
    return <Spinner text="Loading..." />;
  }

  return (
    <EditableSection
      canEdit={canEdit}
      hasSidebarTitle
      renderContent={(editing, setEditing) =>
        editing ? (
          <TagActionForm
            clearSidePanelContent={() => setEditing(false)}
            errors={errors}
            processingCount={taggingMachines.length}
            selectedCount={1}
            selectedMachines={{ items: [machine.system_id] }}
            viewingDetails
            viewingMachineConfig
          />
        ) : (
          <p>
            <TagLinks
              getLinkURL={(tag) => {
                const filter = FilterMachines.filtersToQueryString({
                  tags: [`=${tag.name}`],
                });
                return `${urls.machines.index}${filter}`;
              }}
              tags={tags}
            />
          </p>
        )
      }
      title="Tags"
    />
  );
};

export default TagForm;
