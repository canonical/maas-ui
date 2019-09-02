import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import actions from "app/settings/actions";
import scripts from "app/settings/selectors/scripts";

const Scripts = ({ type = "commissioning" }) => {
  const dispatch = useDispatch();
  const scriptsSelector =
    type === "commissioning" ? scripts.commissioning : scripts.testing;
  const userScripts = useSelector(scriptsSelector);

  useEffect(() => {
    dispatch(actions.scripts.fetch());
  }, [dispatch]);

  return (
    <>
      <h4>
        <span style={{ textTransform: "capitalize" }}>{type}</span> Scripts
      </h4>
      <ul>
        {userScripts.map(item => (
          <li key={item.name}>
            {item.title || item.name} - {item.description}
          </li>
        ))}
      </ul>
    </>
  );
};

Scripts.propTypes = {
  type: PropTypes.string
};

export default Scripts;
