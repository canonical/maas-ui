import { connect } from "react-redux";
import PropTypes from "prop-types";
import React from "react";

import { RepositoryShape } from "../../proptypes";
import actions from "../../actions";
import selectors from "../../selectors";

export class Repositories extends React.Component {
  componentDidMount() {
    this.props.fetchRepositories();
  }

  render() {
    const repositories = this.props.repositories.map(repository => (
      <li key={repository.id}>{repository.name}</li>
    ));
    return (
      <div>
        <h1>Repositories</h1>
        <ul>{repositories}</ul>
      </div>
    );
  }
}

Repositories.propTypes = {
  fetchRepositories: PropTypes.func.isRequired,
  repositories: PropTypes.arrayOf(RepositoryShape).isRequired
};

const mapStateToProps = (state, props) => {
  return {
    repositories: selectors.repositories.get(state, props)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchRepositories: () => {
      dispatch(actions.repositories.fetchRepositories());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Repositories);
