import type { ReactElement } from "react";

import { ContentSection } from "@canonical/maas-react-components";
import { Col, Row, Spinner } from "@canonical/react-components";

import { useGetCurrentUser } from "@/app/api/query/auth";
import { useWindowTitle } from "@/app/base/hooks";
import { EditUser } from "@/app/settings/views/UserManagement/views/UsersList/components";

export enum Label {
  Title = "Details",
}

export const Details = (): ReactElement => {
  const user = useGetCurrentUser();

  useWindowTitle(Label.Title);

  return (
    <ContentSection aria-label={Label.Title}>
      <ContentSection.Title>{Label.Title}</ContentSection.Title>
      <ContentSection.Content>
        <Row>
          <Col size={6}>
            {user.isLoading && <Spinner text="Loading..." />}
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
