import React from "react";
import { useSelector } from "react-redux";

import podSelectors from "app/store/pod/selectors";
import type { RootState } from "app/store/root/types";
import { formatHostType } from "app/kvm/utils";
import DoubleRow from "app/base/components/DoubleRow";

type Props = { id: number };

const TypeColumn = ({ id }: Props): JSX.Element | null => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );

  if (pod) {
    return (
      <DoubleRow
        primary={<span data-test="pod-type">{formatHostType(pod.type)}</span>}
      />
    );
  }
  return null;
};

export default TypeColumn;
