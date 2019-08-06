import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import React from "react";

import { useFetchOnce, useParams } from "app/base/hooks";
import actions from "app/settings/actions";
import Button from "app/base/components/Button";
import Col from "app/base/components/Col";
import List from "app/base/components/List";
import Loader from "app/base/components/Loader";
import Row from "app/base/components/Row";
import selectors from "app/settings/selectors";

const User = () => {
  const { id } = useParams();
  const loading = useSelector(selectors.users.loading);
  const user = useSelector(state =>
    selectors.users.getById(state, parseInt(id))
  );
  const loaded = useFetchOnce(actions.users.fetch, selectors.users.loaded);
  if (loading || !loaded) {
    return <Loader text="Loading..." inline />;
  }
  if (!user) {
    return <h4>User not found</h4>;
  }
  return (
    <>
      <Row>
        <Col size="8">
          <h4>User: {user.username}</h4>
        </Col>
        <Col size="2" className="u-align--right">
          <Button element={Link} to={`/users/${user.id}/edit`}>
            Edit
          </Button>
          <Button
            appearance="negative"
            element={Link}
            to={`/users/${user.id}/delete`}
          >
            Delete
          </Button>
        </Col>
      </Row>
      <List
        items={[
          <>
            <h5>Real name</h5>
            <p>
              {user.first_name} {user.last_name}
            </p>
          </>,
          <>
            <h5>Email</h5>
            <p>{user.email}</p>
          </>,
          <>
            <h5>Machines</h5>
            <p>0</p>
          </>,
          <>
            <h5>Type</h5>
            <p>Local</p>
          </>,
          <>
            <h5>Last seen</h5>
            <p>--</p>
          </>,
          <>
            <h5>Role</h5>
            <p>{user.is_superuser && "Admin"}</p>
          </>,
          <>
            <h5>MAAS keys</h5>
            <p>{user.sshkeys_count}</p>
          </>
        ]}
        split={true}
      />
    </>
  );
};

export default User;
