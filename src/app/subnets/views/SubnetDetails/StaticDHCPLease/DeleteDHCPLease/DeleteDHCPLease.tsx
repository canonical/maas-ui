import { useDispatch, useSelector } from "react-redux";

import type { SubnetActionProps } from "../../types";

import ModelActionForm from "@/app/base/components/ModelActionForm";
import { reservedIpActions } from "@/app/store/reservedip";
import reservedIpSelectors from "@/app/store/reservedip/selectors";
import type { RootState } from "@/app/store/root/types";

type Props = Pick<SubnetActionProps, "setSidePanelContent" | "reservedIpId">;
const DeleteDHCPLease = ({ setSidePanelContent, reservedIpId }: Props) => {
  const dispatch = useDispatch();
  const errors = useSelector(reservedIpSelectors.errors);
  const saving = useSelector(reservedIpSelectors.saving);
  const saved = useSelector(reservedIpSelectors.saved);

  const reservedIp = useSelector((state: RootState) =>
    reservedIpSelectors.getById(state, reservedIpId)
  );

  const handleClose = () => setSidePanelContent(null);

  return (
    <ModelActionForm
      aria-label="Delete static IP"
      cleanup={reservedIpActions.cleanup}
      errors={errors}
      initialValues={{}}
      message={`Are you sure you want to delete ${reservedIp?.ip}? This action is permanent and cannot be undone.`}
      modelType="static IP"
      onCancel={handleClose}
      onSubmit={() => {
        reservedIp &&
          dispatch(
            reservedIpActions.delete({ id: reservedIp.id, ip: reservedIp.ip })
          );
      }}
      onSuccess={handleClose}
      saved={saved}
      saving={saving}
    />
  );
};

export default DeleteDHCPLease;
