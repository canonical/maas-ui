import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import DoubleRow from "app/base/components/DoubleRow";
import kvmURLs from "app/kvm/urls";
import { PodType } from "app/store/pod/constants";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";

type Props = {
  id: Pod["id"];
};

const NameColumn = ({ id }: Props): JSX.Element | null => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );

  if (pod) {
    return (
      <DoubleRow
        primary={
          <Link to={kvmURLs.details({ id })}>
            <strong data-test="pod-name">{pod.name}</strong>
          </Link>
        }
        secondary={
          pod.type === PodType.VIRSH ? (
            <span data-test="power-address">
              {pod.power_parameters.power_address}
            </span>
          ) : (
            <span data-test="project">{pod.power_parameters.project}</span>
          )
        }
      />
    );
  }
  return null;
};

export default NameColumn;
