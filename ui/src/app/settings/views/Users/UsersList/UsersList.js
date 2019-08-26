import { Link } from "react-router-dom";
import { format, parse } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
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

const generateUserRows = (
  users,
  authUser,
  expandedId,
  setExpandedId,
  dispatch,
  displayUsername
) =>
  users.map(user => {
    const expanded = expandedId === user.id;
    // Dates are in the format: Thu, 15 Aug. 2019 06:21:39.
    const last_login = user.last_login
      ? format(
          parse(user.last_login, "E, dd LLL. yyyy HH:mm:ss", new Date()),
          "yyyy-LL-dd H:mm"
        )
      : "Never";
    const fullName =
      (user.first_name || user.last_name) &&
      [user.first_name, user.last_name].filter(Boolean).join(" ");
    return {
      className: expanded ? "p-table__row is-active" : null,
      columns: [
        {
          content: displayUsername ? user.username : fullName || <>&mdash;</>,
          role: "rowheader"
        },
        { content: user.email },
        { content: user.machines_count, className: "u-align--right" },
        { content: user.is_local && "Local" },
        { content: last_login || "Never" },
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

              <span className="p-tooltip p-tooltip--left">
                <Button
                  appearance="base"
                  className="is-small u-justify-table-icon"
                  onClick={() => setExpandedId(user.id)}
                  disabled={user.id === authUser.id}
                >
                  <i className="p-icon--delete">Delete</i>
                </Button>
                {user.id === authUser.id && (
                  <span className="p-tooltip__message">
                    You cannot delete your own user.
                  </span>
                )}
              </span>
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
            <Button
              appearance="negative"
              onClick={() => {
                dispatch(actions.users.delete(user.id));
                setExpandedId();
              }}
            >
              Delete
            </Button>
          </Col>
        </Row>
      ),
      key: user.username,
      sortData: {
        username: user.username,
        fullName: fullName,
        email: user.email,
        machines: user.machines_count,
        type: user.is_local && "local",
        "last-seen": last_login,
        role: user.is_superuser ? "admin" : "user",
        "maas-keys": user.sshkeys_count
      }
    };
  });

const Users = ({ initialCount = 20 }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [displayUsername, setDisplayUsername] = useState(true);

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
            {
              className: "p-table-multi-header",
              content: (
                <>
                  <Button
                    appearance="link"
                    className={classNames("p-table-multi-header__link", {
                      "is-active": displayUsername
                    })}
                    onClick={() => setDisplayUsername(true)}
                  >
                    Username
                  </Button>
                  <span className="p-table-multi-header__spacer">|</span>
                  <Button
                    appearance="link"
                    className={classNames("p-table-multi-header__link", {
                      "is-active": !displayUsername
                    })}
                    onClick={() => setDisplayUsername(false)}
                  >
                    Real name
                  </Button>
                </>
              ),
              sortKey: displayUsername ? "username" : "fullName"
            },
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
          rows={generateUserRows(
            users,
            authUser,
            expandedId,
            setExpandedId,
            dispatch,
            displayUsername
          )}
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
