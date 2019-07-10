import React from "react";
import { Link } from "react-router-dom";

const Nav = () => (
  <nav>
    <ul className="p-inline-list">
      <li className="p-inline-list__item">
        <Link to="/general">General</Link>
      </li>
      <li className="p-inline-list__item">
        <Link to="/users">Users</Link>
      </li>
      <li className="p-inline-list__item">
        <Link to="/repositories">Package repositories</Link>
      </li>
    </ul>
  </nav>
);

export default Nav;
