import React from "react";
import type { ReactNode } from "react";

import type { Pod } from "app/store/pod/types";
import { formatBytes } from "app/utils";
import Meter from "app/base/components/Meter";
import Popover from "app/base/components/Popover";

type Props = {
  children: ReactNode;
  defaultPoolID: Pod["default_storage_pool"];
  pools: Pod["storage_pools"];
};

const StoragePopover = ({
  children,
  defaultPoolID,
  pools,
}: Props): JSX.Element => {
  const sortedPools = [
    pools.find((pool) => pool.id === defaultPoolID),
    ...pools.filter((pool) => pool.id !== defaultPoolID),
  ].filter(Boolean);

  return (
    <Popover
      className="storage-popover"
      content={
        <>
          <div className="storage-popover__header p-table__header">
            <div>Storage</div>
            <div className="u-align--right">Type</div>
            <ul className="p-inline-list u-default-text u-no-margin--bottom">
              <li className="p-inline-list__item">
                <i className="p-icon--allocated is-inline"></i>
                Allocated
              </li>
              <li className="p-inline-list__item">
                <i className="p-icon--free is-inline"></i>
                Free
              </li>
            </ul>
          </div>
          {sortedPools.map((pool) => {
            const isDefaultPool = pool.id === defaultPoolID;
            const allocated = formatBytes(pool.used, "B");
            const free = formatBytes(pool.total - pool.used, "B");
            const total = formatBytes(pool.total, "B");

            return (
              <React.Fragment key={pool.id}>
                <div className="storage-popover__row">
                  <div>
                    <div className="u-truncate" data-test="pool-name">
                      <strong>
                        {isDefaultPool ? `${pool.name} (default)` : pool.name}
                      </strong>
                    </div>
                    <div
                      className="u-text--light u-truncate"
                      data-test="pool-path"
                    >
                      {pool.path}
                    </div>
                  </div>
                  <div className="u-align--right">
                    <div data-test="pool-type">{pool.type}</div>
                    <div>{`${total.value}${total.unit}`}</div>
                  </div>
                  <Meter
                    className="u-no-margin--bottom"
                    data={[
                      {
                        key: `${pool.id}-storage-popover-meter`,
                        value: allocated.value,
                      },
                    ]}
                    label={
                      <ul className="p-inline-list u-no-margin--bottom">
                        <li
                          className="p-inline-list__item"
                          data-test="pool-allocated"
                        >
                          <i className="p-icon--allocated is-inline"></i>
                          {`${allocated.value}${allocated.unit}`}
                        </li>
                        <li
                          className="p-inline-list__item"
                          data-test="pool-free"
                        >
                          <i className="p-icon--free is-inline"></i>
                          {`${free.value}${free.unit}`}
                        </li>
                      </ul>
                    }
                    max={total.value}
                  />
                </div>
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
