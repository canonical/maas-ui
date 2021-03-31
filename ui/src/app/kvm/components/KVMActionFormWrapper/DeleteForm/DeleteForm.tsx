import { useCallback } from "react";

import { Col, Icon, Strip } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import ActionForm from "app/base/components/ActionForm";
import FormikField from "app/base/components/FormikField";
import type { SetSelectedAction } from "app/kvm/views/KVMDetails";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import { PodType } from "app/store/pod/types";

type DeleteFormValues = {
  decompose: boolean;
};

type Props = {
  setSelectedAction: SetSelectedAction;
};

const DeleteFormSchema = Yup.object().shape({
  decompose: Yup.boolean(),
});

const DeleteForm = ({ setSelectedAction }: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const activePod = useSelector(podSelectors.active);
  const errors = useSelector(podSelectors.errors);
  const deleting = useSelector(podSelectors.deleting);
  const cleanup = useCallback(() => podActions.cleanup(), []);

  if (activePod) {
    return (
      <ActionForm
        actionName="remove"
        allowAllEmpty
        allowUnchanged
        cleanup={cleanup}
        clearSelectedAction={() => setSelectedAction(null)}
        errors={errors}
        initialValues={{
          decompose: false,
        }}
        modelName="KVM"
        onSaveAnalytics={{
          action: "Submit",
          category: "KVM details action form",
          label: "Remove KVM",
        }}
        onSubmit={(values: DeleteFormValues) => {
          const params = {
            decompose: values.decompose,
            id: activePod.id,
          };
          dispatch(podActions.delete(params));
        }}
        processingCount={deleting.length}
        selectedCount={deleting.length}
        submitAppearance="negative"
        validationSchema={DeleteFormSchema}
      >
        {activePod && activePod.type === PodType.LXD && (
          <Strip shallow>
            <Col size="6">
              <p>
                <Icon className="is-inline" name="warning" />
                Once a KVM is removed, you can still access all VMs in this
                project from the LXD server.
              </p>
              <FormikField
                label={
                  <>
                    Selecting this option will delete all VMs in{" "}
                    <strong>{activePod.name}</strong> along with their storage.
                  </>
                }
                name="decompose"
                type="checkbox"
                wrapperClassName="u-nudge-right--large"
              />
            </Col>
          </Strip>
        )}
      </ActionForm>
    );
  }
  return null;
};

export default DeleteForm;
