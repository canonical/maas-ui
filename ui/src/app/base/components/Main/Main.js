import { connect } from "react-redux";
import PropTypes from "prop-types";
import React, { useEffect } from "react";

import { fetchAuthUser } from "app/base/actions";
import { AuthUserShape } from "app/base/proptypes";
import Header from "app/base/components/Header";
import Routes from "app/Routes";
import Section from "app/base/components/Section";
import selectors from "app/base/selectors";

export function Main({ authUser, fetchAuthUser }) {
  useEffect(() => {
    fetchAuthUser();
  }, [fetchAuthUser]);

  if (authUser.loading) {
    return <Section title="Loading&hellip;" />;
  }
  if (!authUser.user) {
    return (
      <Section title="You are not authenticated. Please log in to MAAS." />
    );
  }
  return (
    <>
      <Header authUser={authUser.user} />
      <Routes />
    </>
  );
}

Main.propTypes = {
  authUser: PropTypes.shape({
    loading: PropTypes.bool,
    user: AuthUserShape
  }),
  fetchAuthUser: PropTypes.func.isRequired
};

const mapStateToProps = (state, props) => {
  return {
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
