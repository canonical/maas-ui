import classNames from "classnames";

const MacAddressDisplay = ({
  children,
  className,
  ...rest
}: {
  readonly children: React.ReactNode;
  readonly className?: string;
}): React.ReactElement => (
  <span {...rest} className={classNames("u-text--monospace", className)}>
    {children}
  </span>
);

export default MacAddressDisplay;
