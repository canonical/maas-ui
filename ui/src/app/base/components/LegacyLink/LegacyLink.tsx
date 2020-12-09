import * as React from "react";
import type { HTMLProps, ReactNode } from "react";

import { Link } from "@canonical/react-components";
import { generateLegacyURL, navigateToLegacy } from "@maas-ui/maas-ui-shared";

type Props = {
  children: ReactNode;
  route: string;
} & HTMLProps<HTMLAnchorElement>;

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
