type ReleaseTitleCellProps = {
  title: string;
  release: string;
};

const ReleaseTitleCell = ({ title, release }: ReleaseTitleCellProps) => (
  <div>
    <div>{title}</div>
    {title !== release ? (
      <small className="u-text--muted">{release}</small>
    ) : null}
  </div>
);

export default ReleaseTitleCell;
