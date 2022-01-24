import React from "react";

type CommonProps = {
  label: React.ReactNode;
};

type DescriptionProps =
  | {
      children?: never;
      description?: string;
    }
  | {
      children?: React.ReactNode;
      description?: never;
    };

type Props = CommonProps & DescriptionProps;

const Definition = ({ label, children, description }: Props): JSX.Element => (
  <div>
    <p className="u-text--muted">{label}</p>
    {description ? (
      <p>{description}</p>
    ) : (
      React.Children.map(children, (child) => <p>{child}</p>) || <p>—</p>
    )}
  </div>
);

export default Definition;
