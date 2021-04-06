import { Card, Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";

type Props = { id: Pod["id"] };

const ProjectResourcesCard = ({ id }: Props): JSX.Element => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );

  if (pod) {
    return (
      <>
        <h4>{pod.project}</h4>
        <Card>Project resources</Card>
      </>
    );
  }
  return <Spinner text="Loading" />;
};

export default ProjectResourcesCard;
