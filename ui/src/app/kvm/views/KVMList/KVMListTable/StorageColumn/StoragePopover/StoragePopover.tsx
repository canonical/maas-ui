import React from "react";
import type { ReactNode } from "react";

import type { Pod } from "app/store/pod/types";
import { formatBytes } from "app/utils";
import Meter from "app/base/components/Meter";
import Popover from "app/base/components/Popover";

type Props = {
  children: ReactNode;
  pools: Pod["storage_pools"];
};

const StoragePopover = ({ children, pools }: Props): JSX.Element => {
  return (
    <Popover
      className="storage-popover"
      content={
        <>
          {pools.map((pool, i) => {
            const available = formatBytes(pool.total, "B");
            const assigned = formatBytes(pool.used, "B", {
              convertTo: available.unit,
            });

            return (
              <React.Fragment key={pool.id}>
                <div className="storage-popover__pool">
                  <div className="p-grid-list">
                    <div className="p-grid-list__label">Name</div>
                    <div className="p-grid-list__value" data-test="pool-name">
                      {pool.name}
                    </div>
                    <div className="p-grid-list__label">Mount</div>
                    <div className="p-grid-list__value" data-test="pool-path">
                      {pool.path}
                    </div>
                  </div>
                  <div className="p-grid-list">
                    <div className="p-grid-list__label">Type</div>
                    <div className="p-grid-list__value" data-test="pool-type">
                      {pool.type}
                    </div>
                    <div className="p-grid-list__label">Space</div>
                    <div className="p-grid-list__value" data-test="pool-space">
                      <Meter
                        className="u-no-margin--bottom"
                        data={[
                          {
                            key: `${pool.id}-storage-popover-meter`,
                            value: pool.used,
                          },
                        ]}
                        label={`${assigned.value} of ${available.value} ${available.unit} assigned`}
                        labelClassName="u-text--light"
                        max={pool.total}
                      />
                    </div>
                  </div>
                </div>
                {i !== pools.length - 1 && <hr className="u-sv1" />}
              </React.Fragment>
            );
          })}
        </>
      }
    >
      {children}
    </Popover>
  );
};

export default StoragePopover;
