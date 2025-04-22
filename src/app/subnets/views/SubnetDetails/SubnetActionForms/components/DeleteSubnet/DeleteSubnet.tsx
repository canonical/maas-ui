import { Notification } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import FormikForm from "@/app/base/components/FormikForm";
import TitledSection from "@/app/base/components/TitledSection";
import { useFetchActions } from "@/app/base/hooks";
import type { EmptyObject } from "@/app/base/types";
import { subnetActions } from "@/app/store/subnet";
import { useCanBeDeleted, useIsDHCPEnabled } from "@/app/store/subnet/hooks";
import subnetSelectors from "@/app/store/subnet/selectors";
import subnetURLs from "@/app/subnets/urls";
import type { SubnetActionProps } from "@/app/subnets/views/SubnetDetails/types";

export const DeleteSubnet = ({
  subnetId,
  setSidePanelContent,
}: Omit<SubnetActionProps, "activeForm">): React.ReactElement | null => {
  const dispatch = useDispatch();
  const errors = useSelector(subnetSelectors.errors);
  const saving = useSelector(subnetSelectors.saving);
  const saved = useSelector(subnetSelectors.saved);
  const handleClose = () => setSidePanelContent(null);
  const canBeDeleted = useCanBeDeleted(subnetId);
  const dhcpEnabled = useIsDHCPEnabled(subnetId);

  useFetchActions([subnetActions.fetch]);

  return (
    <TitledSection
      className="u-no-padding"
      headingVisuallyHidden
      title="Delete subnet?"
    >
      <FormikForm<EmptyObject>
        aria-label="Delete subnet"
        cleanup={subnetActions.cleanup}
        errors={errors}
        initialValues={{}}
        onCancel={handleClose}
        onSubmit={() => {
          dispatch(subnetActions.delete(subnetId));
        }}
        saved={saved}
        savedRedirect={subnetURLs.index}
        saving={saving}
        submitAppearance="negative"
        submitDisabled={!canBeDeleted}
        submitLabel="Delete"
      >
        {canBeDeleted ? (
          <Notification borderless severity="caution">
            Are you sure you want to delete this subnet?
            {dhcpEnabled ? null : (
              <>
                <br />
                Beware IP addresses on devices on this subnet might not be
                retained.
              </>
            )}
          </Notification>
        ) : (
          <Notification borderless severity="negative">
            This subnet cannot be deleted as there are nodes that have an IP
            address obtained through DHCP services on this subnet. Release these
            nodes in order to proceed.
          </Notification>
        )}
      </FormikForm>
    </TitledSection>
  );
};

export default DeleteSubnet;
