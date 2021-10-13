import * as React from "react";
import type { ReactNode } from "react";

import type { LinkProps, PropsWithSpread } from "@canonical/react-components";
import { Link } from "@canonical/react-components";
import { generateLegacyURL, navigateToLegacy } from "@maas-ui/maas-ui-shared";

type Props = PropsWithSpread<
  {
    children: ReactNode;
    route: string;
  },
  LinkProps
>;

const LegacyLink = ({ children, route, ...linkProps }: Props): JSX.Element => (
  <Link
    href={generateLegacyURL(route)}
    onClick={(evt: React.MouseEvent<HTMLAnchorElement>) => {
      navigateToLegacy(route, evt);
    }}
    {...linkProps}
  >
    {children}
  </Link>
);

export default LegacyLink;
