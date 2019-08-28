import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";

import { auth as authActions } from "app/base/actions";
import Header from "app/base/components/Header";
import Routes from "app/Routes";
import Section from "app/base/components/Section";
import { auth as authSelectors } from "app/base/selectors";

export function Main() {
  const authUser = useSelector(authSelectors.get);
  const authLoading = useSelector(authSelectors.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authActions.fetch());
  }, [dispatch]);

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
      {authUser.is_superuser ? (
        <Routes />
      ) : (
        <Section title="You do not have permission to view this page." />
      )}
    </>
  );
}

export default Main;
