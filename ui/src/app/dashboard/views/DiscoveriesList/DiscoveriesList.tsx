import { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";

import DiscoveriesListHeader from "../DiscoveriesListHeader";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";
import { actions } from "app/store/discovery";
import discoverySelectors from "app/store/discovery/selectors";

const DiscoveriesList = (): JSX.Element => {
  useWindowTitle("Dashboard");

  const discoveries = useSelector(discoverySelectors.all);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetch());
  }, [dispatch]);

  return (
    <Section
      header={<DiscoveriesListHeader />}
      headerClassName="u-no-padding--bottom"
    >
      <table>
        <thead>
          <tr>
            <th style={{ width: "20%" }}>Name</th>
            <th style={{ width: "15%" }}>Mac address</th>
            <th style={{ width: "15%" }}>IP</th>
            <th style={{ width: "15%" }}>Rack</th>
            <th>Last seen</th>
            <th className="u-align--right" style={{ width: "75px" }}>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {discoveries
            ? discoveries.map((discovery) => (
                <tr key={`discovery-${discovery.id}`}>
                  <td style={{ overflow: "visible" }}>
                    {discovery.hostname || "Unknown"}
                    {discovery.is_external_dhcp ? (
                      <div className="p-tooltip--top-center">
                        <i className="p-icon--information ng-hide"></i>
                        <span className="p-tooltip__message" role="tooltip">
                          This device is providing DHCP
                        </span>
                      </div>
                    ) : null}
                  </td>
                  <td>
                    <div className="u-truncate">
                      {discovery.mac_address || "Unknown"}
                    </div>
                    <div className="u-truncate">
                      <small>{discovery.mac_organization}</small>
                    </div>
                  </td>
                  <td className="u-truncate">{discovery.ip}</td>
                  <td className="u-truncate">{discovery.observer_hostname}</td>
                  <td className="u-truncate">{discovery.last_seen}</td>
                  <td className="u-truncate">&nbsp;</td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
    </Section>
  );
};

export default DiscoveriesList;
