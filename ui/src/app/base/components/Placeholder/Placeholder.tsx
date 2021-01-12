import type { ReactNode } from "react";

import classNames from "classnames";

type Props = {
  children: ReactNode;
  className?: string;
};

const Placeholder = ({ children, className }: Props): JSX.Element => {
  const delay = Math.floor(Math.random() * 750);
  return (
    <span
      className={classNames("p-placeholder", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </span>
  );
};

export default Placeholder;
