import { connect } from "react-redux";
import PropTypes from "prop-types";
import React, { useEffect } from "react";

import { fetchAuthUser } from "app/base/actions";
import { UserShape } from "app/base/proptypes";
import Header from "app/base/components/Header";
import Routes from "app/Routes";
import Section from "app/base/components/Section";
import selectors from "app/base/selectors";

export function Main({ authUser, authLoading, fetchAuthUser }) {
  useEffect(() => {
    fetchAuthUser();
  }, [fetchAuthUser]);

  if (authLoading) {
    return <Section title="Loading&hellip;" />;
  }
  if (!authUser) {
    return (
      <Section title="You are not authenticated. Please log in to MAAS." />
    );
  }
  return (
    <>
      <Header authUser={authUser} />
      <Routes />
    </>
  );
}

Main.propTypes = {
  authUser: UserShape,
  fetchAuthUser: PropTypes.func.isRequired,
  authLoading: PropTypes.bool
};

const mapStateToProps = (state, props) => {
  return {
    authLoading: selectors.auth.getAuthUserLoading(state, props),
    authUser: selectors.auth.getAuthUser(state, props)
  };
};

const mapDispatchToProps = {
  fetchAuthUser
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);
