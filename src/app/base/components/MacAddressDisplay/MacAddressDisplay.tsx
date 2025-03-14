import classNames from "classnames";

const MacAddressDisplay = ({
  children,
  className,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span {...rest} className={classNames("u-text--monospace", className)}>
    {children}
  </span>
);

export default MacAddressDisplay;
