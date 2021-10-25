import { Icon } from "@canonical/react-components";
import type { Location } from "history";
import { Link, useLocation } from "react-router-dom";

type LocationState = {
  from?: string;
};

const SettingsBackLink = (): JSX.Element | null => {
  const location = useLocation<Location>();
  const state = location.state as LocationState;
  if (state === undefined || !state.from) {
    return null;
  }

  return (
    <div className="settings-back-link">
      <Link className="settings-back-link__link" to={state.from}>
        <Icon className="u-rotate-right u-no-margin--left" name="chevron-up" />
        <span>Back</span>
      </Link>
      <hr className="settings-back-link__divider" />
    </div>
  );
};

export default SettingsBackLink;
