import { Link } from "react-router-dom";
import { format, parse } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import React, { useEffect, useState } from "react";

import "./UsersList.scss";
import { messages } from "app/base/actions";
import { user as userActions } from "app/base/actions";
import { user as userSelectors } from "app/base/selectors";
import { auth } from "app/base/selectors";
import Button from "app/base/components/Button";
import Loader from "app/base/components/Loader";
import MainTable from "app/base/components/MainTable";
import SearchBox from "app/base/components/SearchBox";
import TableDeleteConfirm from "app/base/components/TableDeleteConfirm";

const generateUserRows = (
  users,
  authUser,
  expandedId,
  setExpandedId,
  dispatch,
  displayUsername,
  setDeleting
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
        <TableDeleteConfirm
          modelName={user.username}
          modelType="user"
          onCancel={setExpandedId}
          onConfirm={() => {
            dispatch(userActions.delete(user.id));
            setDeleting(user.username);
            setExpandedId();
          }}
        />
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

const Users = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [displayUsername, setDisplayUsername] = useState(true);
  const [deletingUser, setDeleting] = useState();
  const users = useSelector(state => userSelectors.search(state, searchText));
  const loading = useSelector(userSelectors.loading);
  const loaded = useSelector(userSelectors.loaded);
  const authUser = useSelector(auth.get);
  const saved = useSelector(userSelectors.saved);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userActions.fetch());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      // Clean up saved and error states on unmount.
      dispatch(userActions.cleanup());
    };
  }, [dispatch]);

  useEffect(() => {
    if (saved) {
      dispatch(
        messages.add(`${deletingUser} removed successfully.`, "information")
      );
      setDeleting();
      dispatch(userActions.cleanup());
    }
  }, [deletingUser, dispatch, saved]);

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
          paginate={20}
          rows={generateUserRows(
            users,
            authUser,
            expandedId,
            setExpandedId,
            dispatch,
            displayUsername,
            setDeleting
          )}
          sortable={true}
        />
      )}
    </>
  );
};

export default Users;
