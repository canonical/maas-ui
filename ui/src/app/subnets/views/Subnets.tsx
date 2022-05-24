import type { PropsWithChildren, ReactNode } from "react";

import { useScrollToTop } from "app/base/hooks";

const Subnets = ({ children }: PropsWithChildren<ReactNode>): JSX.Element => {
  useScrollToTop();

  return <>{children}</>;
};

export default Subnets;
