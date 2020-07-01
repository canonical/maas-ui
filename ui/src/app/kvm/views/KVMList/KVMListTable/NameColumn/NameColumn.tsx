import { Input } from "@canonical/react-components";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { pod as podSelectors } from "app/base/selectors";
import { Pod } from "app/store/pod/types";
import { RootState } from "app/store/root/types";
import DoubleRow from "app/base/components/DoubleRow";

type Props = { handleCheckbox: (pod: Pod) => void; id: number };

const NameColumn = ({ handleCheckbox, id }: Props): JSX.Element => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );
  const selectedPodIDs = useSelector(podSelectors.selectedIDs);

  return (
    <DoubleRow
      primary={
        <Input
          checked={selectedPodIDs.includes(pod.id)}
          className="has-inline-label keep-label-opacity"
          data-test="pod-checkbox"
          id={`${pod.id}`}
          label={
            <Link to={`/kvm/${pod.id}`}>
              <strong>{pod.name}</strong>
            </Link>
          }
          onChange={() => handleCheckbox(pod)}
          type="checkbox"
          wrapperClassName="u-no-margin--bottom u-nudge--checkbox"
        />
      }
    />
  );
};

export default NameColumn;
