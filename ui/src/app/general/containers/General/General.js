import { connect } from "react-redux";
import { createSelector } from "reselect";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import React, { useEffect } from "react";

import Section from "app/base/components/Section";

export function General(props) {
  const { fetchMachines } = props;
  useEffect(() => {
    fetchMachines();
  }, [fetchMachines]);

  const machines = props.machines.map(machine => (
    <li key={machine.id}>{machine.title}</li>
  ));
  return (
    <Section title="General">
      <h4>General</h4>
      <ul>{machines}</ul>
      <Link to="/settings/users">Settings</Link>
    </Section>
  );
}

General.propTypes = {
  machines: PropTypes.arrayOf(
    PropTypes.shape({
      ready: PropTypes.bool,
      title: PropTypes.string.isRequired
    })
  )
};

// Filters will live inside their respective modules.
const getMachines = (state, props) => state.machines;

const getReadyMachines = createSelector(
  [getMachines],
  machines => machines.filter(machine => machine.ready)
);

// Actions like this will live in an actions file.
function fetchMachines() {
  return { type: "LIST_MACHINES" };
}

const mapStateToProps = (state, props) => {
  return {
    machines: getReadyMachines(state, props)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchMachines: () => {
      dispatch(fetchMachines());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(General);
