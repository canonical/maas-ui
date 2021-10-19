import { Icon } from "@canonical/react-components";
import { Link } from "react-router-dom";

type Props = {
  returnToList: "lxd" | "virsh";
};

const SettingsBackLink = ({ returnToList }: Props): JSX.Element | null => {
  if (!returnToList) {
    return null;
  }

  return (
    <div className="settings-back-link">
      <Link className="settings-back-link__link" to={`/kvm/${returnToList}`}>
        <Icon className="u-rotate-right" name="chevron-up" />
        <span className="u-nudge-right--x-small">Back</span>
      </Link>
      <hr className="settings-back-link__divider" />
    </div>
  );
};

export default SettingsBackLink;
