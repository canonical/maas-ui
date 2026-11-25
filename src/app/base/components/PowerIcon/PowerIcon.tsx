import type { ReactNode } from "react";

import { Icon } from "@canonical/react-components";
import { Spinner } from "@canonical/react-ds-global";
import classNames from "classnames";

import { dsIconRoot } from "@/app/base/components/Spinner";
import { PowerState } from "@/app/store/types/enum";

import "./_index.scss";

type Props = {
  children?: ReactNode;
  className?: string;
  powerState: PowerState;
  showSpinner?: boolean;
};

const getIconName = (powerState: PowerState): string => {
  switch (powerState) {
    case PowerState.ERROR:
      return "power-error";
    case PowerState.OFF:
      return "power-off";
    case PowerState.ON:
      return "power-on";
    case PowerState.UNKNOWN:
      return "power-unknown";
    default:
      return "power-unknown";
  }
};

const PowerIcon = ({
  children,
  className,
  powerState,
  showSpinner,
}: Props): React.ReactElement => {
  const iconClass = classNames(className, {
    "is-inline": Boolean(children),
  });

  return (
    <span>
      {showSpinner ? (
        <Spinner
          aria-label="loading"
          className={iconClass}
          rootPath={dsIconRoot}
        />
      ) : (
        <Icon
          aria-label={powerState}
          className={iconClass}
          name={getIconName(powerState)}
        />
      )}
      {children}
    </span>
  );
};

export default PowerIcon;
