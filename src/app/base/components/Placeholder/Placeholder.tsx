import type { ReactNode } from "react";

import classNames from "classnames";

type Props = {
  children: ReactNode;
  className?: string;
  loading?: boolean;
};

const Placeholder = ({
  children,
  className,
  loading = true,
}: Props): JSX.Element => {
  const delay = Math.floor(Math.random() * 750);
  if (loading) {
    return (
      <span
        aria-hidden={true}
        className={classNames("p-placeholder", className)}
        data-testid="placeholder"
        style={{ animationDelay: `${delay}ms` }}
      >
        {children}
      </span>
    );
  }
  return <>{children}</>;
};

export default Placeholder;
