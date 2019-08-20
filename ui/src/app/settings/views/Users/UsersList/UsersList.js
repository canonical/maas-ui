import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

import "./UsersList.scss";
import actions from "app/settings/actions";
import selectors from "app/settings/selectors";
import baseSelectors from "app/base/selectors";
import Button from "app/base/components/Button";
import Col from "app/base/components/Col";
import Loader from "app/base/components/Loader";
import Pagination from "app/base/components/Pagination";
import MainTable from "app/base/components/MainTable";
import Row from "app/base/components/Row";
import SearchBox from "app/base/components/SearchBox";

const generateUserRows = (users, authUser, expandedId, setExpandedId) =>
  users.map(user => {
    const expanded = expandedId === user.id;
    return {
      className: expanded ? "p-table__row is-active" : null,
      columns: [
        {
          content: user.username,
          role: "rowheader"
        },
        { content: user.email },
        { content: "--", className: "u-align--right" },
        { content: "--" },
        { content: "--" },
        {
          content: user.is_superuser ? "Admin" : "User"
        },
        {
          content: user.sshkeys_count,
          className: "u-align--right"
        },
        {
          content: (
            <>
              <Button
                appearance="base"
                element={Link}
                to={`/users/${user.id}/edit`}
                className="is-small u-justify-table-icon"
              >
                <i className="p-icon--edit">Edit</i>
              </Button>
              {user.id !== authUser.id && (
                <Button
                  appearance="base"
                  className="is-small u-justify-table-icon"
                  onClick={() => setExpandedId(user.id)}
                >
                  <i className="p-icon--delete">Delete</i>
                </Button>
              )}
            </>
          ),
          className: "u-align--right u-align-icons--top"
        }
      ],
      expanded: expanded,
      expandedContent: expanded && (
        <Row>
          <Col size="7">
            Are you sure you want to delete user "{user.username}"?{" "}
            <span className="u-text--light">
              This action is permanent and can not be undone.
            </span>
          </Col>
          <Col size="3" className="u-align--right">
            <Button onClick={() => setExpandedId()}>Cancel</Button>
            <Button appearance="negative">Delete</Button>
          </Col>
        </Row>
      ),
      key: user.username,
      sortData: {
        username: user.username,
        email: user.email,
        machines: "--",
        type: "--",
        "last-seen": "--",
        role: user.is_superuser ? "admin" : "user",
        "maas-keys": user.sshkeys_count
      }
    };
  });

const Users = ({ initialCount = 20 }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [searchText, setSearchText] = useState("");

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.users.fetch());
  }, [dispatch]);

  const users = useSelector(state => selectors.users.search(state, searchText));
  const userCount = useSelector(selectors.users.count);
  const loading = useSelector(selectors.users.loading);
  const loaded = useSelector(selectors.users.loaded);
  const authUser = useSelector(baseSelectors.auth.getAuthUser);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(initialCount);

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <>
      {loading && <Loader text="Loading..." inline />}
      <div className="p-table-actions">
        <SearchBox onChange={setSearchText} value={searchText} />
        <Button element={Link} to="/users/add">
          Add user
        </Button>
      </div>
      {loaded && (
        <MainTable
          className="p-table-expanding--light user-list"
          defaultSort="username"
          defaultSortDirection="ascending"
          expanding={true}
          headers={[
            { content: "Username", sortKey: "username" },
            { content: "Email", sortKey: "email" },
            {
              content: "Machines",
              className: "u-align--right",
              sortKey: "machines"
            },
            {
              content: "Type",
              sortKey: "type"
            },
            {
              content: "Last seen",
              sortKey: "last-seen"
            },
            {
              content: "Role",
              sortKey: "role"
            },
            {
              content: "MAAS keys",
              className: "u-align--right",
              sortKey: "maas-keys"
            },
            {
              content: "Actions",
              className: "u-align--right"
            }
          ]}
          rowLimit={itemsPerPage}
          rows={generateUserRows(users, authUser, expandedId, setExpandedId)}
          rowStartIndex={indexOfFirstItem}
          sortable={true}
        />
      )}
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={userCount}
        paginate={paginate}
        currentPage={currentPage}
      />
    </>
  );
};

Users.propTypes = {
  initialCount: PropTypes.number
};

export default Users;
