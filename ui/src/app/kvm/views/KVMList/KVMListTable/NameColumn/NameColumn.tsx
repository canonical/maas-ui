import { Input } from "@canonical/react-components";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import DoubleRow from "app/base/components/DoubleRow";
import podSelectors from "app/store/pod/selectors";

import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";

type Props = {
  handleCheckbox: (podID: Pod["id"]) => void;
  id: number;
  selected: boolean;
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
          <Input
            checked={selected}
            className="has-inline-label keep-label-opacity"
            data-test="pod-checkbox"
            id={`${id}`}
            label={
              <Link to={`/kvm/${id}`}>
                <strong>{pod.name}</strong>
              </Link>
            }
            onChange={handleCheckbox}
            type="checkbox"
            wrapperClassName="u-no-margin--bottom u-nudge--checkbox"
          />
        }
      />
    );
  }
  return null;
};

export default NameColumn;
