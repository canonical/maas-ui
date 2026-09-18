import { Icon, Tooltip } from "@canonical/react-components";

type ReleaseTitleCellProps = {
  title: string;
  release: string;
  commissioningRelease?: string;
};

const ReleaseTitleCell = ({
  title,
  release,
  commissioningRelease,
}: ReleaseTitleCellProps) => (
  <div>
    <div className="release-title">
      {title}{" "}
      {release === commissioningRelease ? (
        <Tooltip message="This image is a default commissioning release.">
          <Icon aria-label="Default commissioning release" name="default" />
        </Tooltip>
      ) : null}
    </div>
    {title !== release ? (
      <small className="u-text--muted">{release}</small>
    ) : null}
  </div>
);

export default ReleaseTitleCell;
