import React from "react";

const VisuallyHidden = ({
  children,
}: {
  readonly children: React.ReactNode;
}): React.ReactElement => <div className="u-visually-hidden">{children}</div>;

export default VisuallyHidden;
