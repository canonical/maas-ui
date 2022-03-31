import { useCallback, useEffect, useState } from "react";

import { Button, Col, Row, Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import FormikForm from "app/base/components/FormikForm";
import TagLinks from "app/base/components/TagLinks";
import { useCanEdit } from "app/base/hooks";
import type { EmptyObject } from "app/base/types";
import machineURLs from "app/machines/urls";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { MachineDetails } from "app/store/machine/types";
import { FilterMachines, isMachineDetails } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import { actions as tagActions } from "app/store/tag";
import tagSelectors from "app/store/tag/selectors";

type Props = { systemId: MachineDetails["system_id"] };

const TagForm = ({ systemId }: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const tags = useSelector((state: RootState) =>
    tagSelectors.getByIDs(state, machine?.tags || [])
  );
  const tagsLoading = useSelector(tagSelectors.loading);
  const errors = useSelector(machineSelectors.errors);
  const saved = useSelector(machineSelectors.saved);
  const saving = useSelector(machineSelectors.saving);
  const cleanup = useCallback(() => machineActions.cleanup(), []);
  const [editing, setEditing] = useState(false);
  const canEdit = useCanEdit(machine, true);

  useEffect(() => {
    dispatch(tagActions.fetch());
  }, [dispatch]);

  if (!isMachineDetails(machine) || tagsLoading) {
    return <Spinner text="Loading..." />;
  }

  return (
    <Row>
      <Col size={3}>
        <div className="u-flex--between u-flex--wrap">
          <h4>Tags</h4>
          {canEdit && !editing && (
            <Button
              className="u-no-margin--bottom u-hide--large"
              onClick={() => setEditing(true)}
            >
              Edit
            </Button>
          )}
        </div>
      </Col>
      <Col size={editing ? 9 : 6}>
        {editing ? (
          <FormikForm<EmptyObject>
            aria-label="tag-form"
            cleanup={cleanup}
            errors={errors}
            initialValues={{}}
            onSaveAnalytics={{
              action: "Update machine tags",
              category: "Machine details",
              label: "Save changes",
            }}
            onCancel={() => setEditing(false)}
            onSubmit={() => {
              return;
            }}
            onSuccess={() => setEditing(false)}
            saved={saved}
            saving={saving}
            submitDisabled
            submitLabel="Save changes"
          />
        ) : (
          <p>
            <TagLinks
              getLinkURL={(tag) => {
                const filter = FilterMachines.filtersToQueryString({
                  tags: [`=${tag.name}`],
                });
                return `${machineURLs.machines.index}${filter}`;
              }}
              tags={tags}
            />
          </p>
        )}
      </Col>
      {canEdit && !editing && (
        <Col className="u-align--right" size={3}>
          <Button
            className="u-no-margin--bottom u-hide--small u-hide--medium"
            onClick={() => setEditing(true)}
          >
            Edit
          </Button>
        </Col>
      )}
    </Row>
  );
};

export default TagForm;
