import { useSelector } from "react-redux";

import DoubleRow from "app/base/components/DoubleRow";
import podSelectors from "app/store/pod/selectors";
import { PodType } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";

type Props = { id: number };

const VMsColumn = ({ id }: Props): JSX.Element | null => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );
  const showVersion = pod?.type === PodType.LXD;

  if (pod) {
    return (
      <DoubleRow
        primary={
          <span data-test="pod-machines-count">
            {pod.composed_machines_count}
          </span>
        }
        primaryClassName="u-align--right"
        secondary={
          showVersion && <span data-test="pod-version">{pod.version}</span>
        }
      />
    );
  }
  return null;
};

export default VMsColumn;
