import { useDispatch, useSelector } from "react-redux";

import ModelActionForm from "@/app/base/components/ModelActionForm";
import {
  useSidePanel,
  type SetSidePanelContent,
} from "@/app/base/side-panel-context";
import { ipRangeActions } from "@/app/store/iprange";
import ipRangeSelectors from "@/app/store/iprange/selectors";

type Props = {
  setActiveForm: SetSidePanelContent;
};

const ReservedRangeDeleteForm = ({ setActiveForm }: Props) => {
  const dispatch = useDispatch();
  const { sidePanelContent } = useSidePanel();
  const saved = useSelector(ipRangeSelectors.saved);
  const saving = useSelector(ipRangeSelectors.saving);
  const ipRangeId =
    sidePanelContent?.extras && "ipRangeId" in sidePanelContent.extras
      ? sidePanelContent?.extras?.ipRangeId
      : null;

  if (!ipRangeId && ipRangeId !== 0) {
    return <p>IP range not provided</p>;
  }

  return (
    <ModelActionForm
      aria-label="Confirm IP range deletion"
      initialValues={{}}
      message="Ensure all in-use IP addresses are registered in MAAS before releasing this range to avoid potential collisions. Are you sure you want to remove this IP range?"
      modelType="IP range"
      onCancel={() => setActiveForm(null)}
      onSubmit={() => {
        dispatch(ipRangeActions.delete(ipRangeId));
      }}
      saved={saved}
      saving={saving}
    />
  );
};

export default ReservedRangeDeleteForm;
