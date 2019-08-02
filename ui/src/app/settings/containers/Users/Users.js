import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";

import actions from "app/settings/actions";
import selectors from "app/settings/selectors";
import baseSelectors from "app/base/selectors";
import Button from "app/base/components/Button";
import Col from "app/base/components/Col";
import Loader from "app/base/components/Loader";
import MainTable from "app/base/components/MainTable";
import Row from "app/base/components/Row";

const generateUserRows = (users, authUser) =>
  users.map(user => ({
    columns: [
      { content: user.username, role: "rowheader" },
      { content: user.email },
      { content: 37, className: "u-align--right" },
      { content: "Local" },
      { content: "12 mins ago" },
      { content: user.is_superuser ? "Admin" : null },
      { content: user.sshkeys_count, className: "u-align--right" },
      {
        content: (
          <>
            <Link
              to={`/users/${user.id}/edit`}
              className="p-button--base is-small"
            >
              <i className="p-icon--edit">Edit</i>
            </Link>
            {user.id !== authUser.id && (
              <Link
                to={`/users/${user.id}/delete`}
                className="p-button--base is-small"
              >
                <i className="p-icon--delete">Delete</i>
              </Link>
            )}
          </>
        ),
        className: "u-align--right"
      }
    ],
    key: user.username,
    sortData: {
      username: user.username,
      email: user.email,
      machines: 37,
      type: "local",
      "last-seen": "2018-05-12",
      role: user.is_superuser ? "Admin" : null,
      "maas-keys": user.sshkeys_count
    }
  }));

const useFetchOnce = (fetchAction, loadedSelector) => {
  const dispatch = useDispatch();
  const loaded = useSelector(loadedSelector);
  useEffect(() => {
    if (!loaded) {
      dispatch(fetchAction());
    }
  }, [loaded, dispatch, fetchAction, loadedSelector]);
  return loaded;
};

const Users = ({ initialCount = 20 }) => {
  const [batchSize, setBatch] = useState(initialCount);
  const users = useSelector(state => selectors.users.get(state, batchSize));
  const userCount = useSelector(selectors.users.count);
  const loading = useSelector(selectors.users.loading);
  const authUser = useSelector(baseSelectors.auth.getAuthUser);

  const loaded = useFetchOnce(actions.users.fetch, selectors.users.loaded);

  return (
    <>
      {loading && <Loader text="Loading..." inline />}
      <Row>
        <Col size="1" emptyLarge="11" className="u-align--right">
          <Button element={Link} to="/users/add">
            Add user
          </Button>
        </Col>
      </Row>
      {loaded && (
        <MainTable
          defaultSort="username"
          defaultSortDirection="ascending"
          headers={[
            { content: "Username", sortKey: "username" },
            { content: "Email", sortKey: "email" },
            {
              content: "Machines",
              className: "u-align--right",
              sortKey: "machines"
            },
            { content: "Type", sortKey: "type" },
            { content: "Last seen", sortKey: "last-seen" },
            { content: "Role", sortKey: "role" },
            {
              content: "MAAS keys",
              className: "u-align--right",
              sortKey: "maas-keys"
            },
            { content: "Actions", className: "u-align--right" }
          ]}
          rows={generateUserRows(users, authUser)}
          sortable={true}
        />
      )}
      {userCount > users.length && (
        <Button
          onClick={() => {
            setBatch(undefined);
          }}
        >
          View all (<small>{userCount - users.length} more</small>)
        </Button>
      )}
    </>
  );
};

Users.propTypes = {
  initialCount: PropTypes.number
};

export default Users;
