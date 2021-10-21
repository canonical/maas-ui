import { Icon } from "@canonical/react-components";
import { Link, useHistory } from "react-router-dom";

type LocationState = {
  from?: string;
};

const SettingsBackLink = (): JSX.Element | null => {
  const history = useHistory();
  const state = history.location.state as LocationState;

  if (state === undefined) {
    return null;
  }

  let location = state.from as string;
  location = location.replace("/MAAS/r", "");

  return (
    <div className="settings-back-link">
      <Link className="settings-back-link__link" to={location}>
        <Icon className="u-rotate-right u-no-margin--left" name="chevron-up" />
        <span>Back</span>
      </Link>
      <hr className="settings-back-link__divider" />
    </div>
  );
};

export default SettingsBackLink;
