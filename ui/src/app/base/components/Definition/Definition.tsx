type CommonProps = {
  label: React.ReactNode;
};

type DescriptionProps =
  | {
      children?: never;
      description?: React.ReactNode;
    }
  | {
      children?: React.ReactNode;
      description?: never;
    };

type Props = CommonProps & DescriptionProps;

const Definition = ({ label, children, description }: Props): JSX.Element => (
  <div>
    <p className="u-text--muted">{label}</p>
    <p>{description || children || "—"}</p>
  </div>
);

export default Definition;
