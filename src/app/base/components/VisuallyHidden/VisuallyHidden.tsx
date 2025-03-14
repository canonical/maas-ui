import React from "react";

const VisuallyHidden = ({ children }: { children: React.ReactNode }) => (
  <div className="u-visually-hidden">{children}</div>
);

export default VisuallyHidden;
