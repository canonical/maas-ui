import type { ReactElement } from "react";

import { ContentSection } from "@canonical/maas-react-components";
import { Col, Notification, Row, Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import { useGetCurrentUser } from "@/app/api/query/auth";
import { useWindowTitle } from "@/app/base/hooks";
import EditUser from "@/app/settings/views/Users/components/EditUser/EditUser";
import statusSelectors from "@/app/store/status/selectors";

export enum Label {
  Title = "Details",
}

export const Details = (): ReactElement => {
  const externalAuthURL = useSelector(statusSelectors.externalAuthURL);

  const user = useGetCurrentUser();

  useWindowTitle(Label.Title);

  return (
    <ContentSection aria-label={Label.Title}>
      <ContentSection.Title>{Label.Title}</ContentSection.Title>
      <ContentSection.Content>
        {externalAuthURL && (
          <Notification severity="information">
            Users for this MAAS are managed using an external service
          </Notification>
        )}
        <Row>
          <Col size={6}>
            {user.isPending && <Spinner text="Loading..." />}
            {user.isSuccess && user.data && (
              <EditUser id={user.data?.id} isSelfEditing={true} />
            )}
          </Col>
        </Row>
      </ContentSection.Content>
    </ContentSection>
  );
};

export default Details;
