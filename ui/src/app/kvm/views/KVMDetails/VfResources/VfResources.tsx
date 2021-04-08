import classNames from "classnames";

import type { PodNetworkInterface } from "app/store/pod/types";

export type Props = {
  dynamicLayout?: boolean;
  interfaces: PodNetworkInterface[];
};

const VfResources = ({
  dynamicLayout = false,
  interfaces,
}: Props): JSX.Element => {
  const noInterfaces = interfaces.length === 0;
  return (
    <div
      className={classNames("vf-resources", {
        "vf-resources--dynamic-layout": dynamicLayout,
      })}
    >
      <h4 className="vf-resources__header p-heading--small">
        Virtual functions
      </h4>
      <div className="vf-resources__table-container">
        <table className="vf-resources__table">
          <thead>
            <tr>
              <th></th>
              <th className="u-align--right u-text--light">
                Allocated
                <span className="u-nudge-right--small">
                  <i className="p-circle--link"></i>
                </span>
              </th>
              <th className="u-align--right u-text--light">
                Free
                <span className="u-nudge-right--small">
                  <i className="p-circle--link-faded"></i>
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {noInterfaces && (
              <tr data-test="no-interfaces">
                <td>
                  <p>
                    <em>None</em>
                  </p>
                </td>
                <td></td>
                <td></td>
              </tr>
            )}
            {interfaces.map((iface) => {
              const { id, name, virtual_functions } = iface;
              const {
                allocated_other,
                allocated_tracked,
                free,
              } = virtual_functions;
              const allocatedVfs = allocated_other + allocated_tracked;
              const hasVfs = allocatedVfs + free > 0;

              return (
                <tr key={`interface-${id}`}>
                  <td>{name}:</td>
                  {hasVfs ? (
                    <>
                      <td className="u-align--right" data-test="has-vfs">
                        {allocatedVfs}
                        <span className="u-nudge-right--small">
                          <i className="p-circle--link"></i>
                        </span>
                      </td>
                      <td className="u-align--right">
                        {free}
                        <span className="u-nudge-right--small">
                          <i className="p-circle--link-faded"></i>
                        </span>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="u-align--right" data-test="has-no-vfs">
                        &mdash;
                      </td>
                      <td></td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VfResources;
