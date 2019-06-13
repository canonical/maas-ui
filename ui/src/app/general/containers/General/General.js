import { connect } from "react-redux";
import { createSelector } from "reselect";
import PropTypes from "prop-types";
import React from "react";

export class General extends React.Component {
  componentDidMount() {
    // Machines are fetched here in this demo for convenience.
    this.props.fetchMachines();
  }

  render() {
    const machines = this.props.machines.map(machine => (
      <li key={machine.id}>{machine.title}</li>
    ));
    return (
      <div>
        <h1>General</h1>
        <ul>{machines}</ul>
      </div>
    );
  }
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
