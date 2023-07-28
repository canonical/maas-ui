import type { ReactNode } from "react";

import classNames from "classnames";

import KVMResourceMeter from "app/kvm/components/KVMResourceMeter";
import type { PodNetworkInterface, PodResource } from "app/store/pod/types";
import { simpleSortByKey } from "app/utils";

export type Props = {
  dynamicLayout?: boolean;
  interfaces: PodNetworkInterface[];
  showAggregated?: boolean;
};

const VfResources = ({
  dynamicLayout = false,
  interfaces,
  showAggregated = false,
}: Props): JSX.Element => {
  let content: ReactNode;
  if (showAggregated) {
    const [allocatedVFs, freeVFs, otherVFs] = interfaces.reduce<
      [
        PodResource["allocated_tracked"],
        PodResource["free"],
        PodResource["allocated_other"]
      ]
    >(
      ([allocated, free, other], { virtual_functions }) => {
        allocated += virtual_functions.allocated_tracked;
        free += virtual_functions.free;
        other += virtual_functions.allocated_other;
        return [allocated, free, other];
      },
      [0, 0, 0]
    );
    content = (
      <>
        <h4 className="vf-resources__header p-heading--small u-sv1">
          Virtual functions
        </h4>
        <div className="vf-resources__meter" data-testid="iface-meter">
          <KVMResourceMeter
            allocated={allocatedVFs}
            detailed
            free={freeVFs}
            other={otherVFs}
            segmented
          />
        </div>
      </>
    );
  } else {
    const noInterfaces = interfaces.length === 0;
    content = (
      <div className="vf-resources__table-container" data-testid="iface-table">
        <h4 className="p-text--x-small-capitalised">Virtual Functions</h4>
        <table className="vf-resources__table">
          <thead>
            <tr>
              <th className="u-text--light">Interfaces</th>
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
              <tr data-testid="no-interfaces">
                <td>
                  <p>
                    <em>None</em>
                  </p>
                </td>
                <td></td>
                <td></td>
              </tr>
            )}
            {[...interfaces].sort(simpleSortByKey("name")).map((iface) => {
              const { id, name, virtual_functions } = iface;
              const { allocated_other, allocated_tracked, free } =
                virtual_functions;
              const allocatedVfs = allocated_other + allocated_tracked;
              const hasVfs = allocatedVfs + free > 0;

              return (
                <tr key={`interface-${id}`}>
                  <td data-testid="interface-name">{name}:</td>
                  {hasVfs ? (
                    <>
                      <td className="u-align--right" data-testid="has-vfs">
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
                      <td className="u-align--right" data-testid="has-no-vfs">
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
    );
  }
  return (
    <div
      aria-label="VF resources"
      className={classNames("vf-resources", {
        "vf-resources--dynamic-layout": dynamicLayout,
      })}
    >
      {content}
    </div>
  );
};

export default VfResources;
