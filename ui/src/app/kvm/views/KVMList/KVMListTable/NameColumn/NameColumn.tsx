import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import DoubleRow from "app/base/components/DoubleRow";
import RowCheckbox from "app/base/components/RowCheckbox";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";

type Props = {
  handleCheckbox: (podID: Pod["id"]) => void;
  id: Pod["id"];
  selected: Pod["id"][];
};

const NameColumn = ({
  handleCheckbox,
  id,
  selected,
}: Props): JSX.Element | null => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );

  if (pod) {
    return (
      <DoubleRow
        primary={
          <RowCheckbox
            data-test="pod-checkbox"
            handleRowCheckbox={handleCheckbox}
            item={id}
            items={selected}
            inputLabel={
              <Link to={`/kvm/${id}`}>
                <strong>{pod.name}</strong>
              </Link>
            }
          />
        }
      />
    );
  }
  return null;
};

export default NameColumn;
