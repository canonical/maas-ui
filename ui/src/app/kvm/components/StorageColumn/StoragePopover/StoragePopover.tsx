import type { ReactNode } from "react";
import { Fragment } from "react";

import Meter from "app/base/components/Meter";
import Popover from "app/base/components/Popover";
import { COLOURS } from "app/base/constants";
import type { KVMStoragePoolResources } from "app/kvm/types";
import { formatBytes } from "app/utils";

type Props = {
  children: ReactNode;
  pools: KVMStoragePoolResources;
};

const StoragePopover = ({ children, pools }: Props): JSX.Element => {
  const poolsArray = Object.entries(pools);
  const showOthers = poolsArray.some((pool) => pool[1].allocated_other !== 0);
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
                <i className="p-circle--link is-inline"></i>
                Allocated
              </li>
              {showOthers && (
                <li className="p-inline-list__item" data-test="others-key">
                  <i className="p-circle--positive is-inline"></i>
                  Others
                </li>
              )}
              <li className="p-inline-list__item">
                <i className="p-circle--link-faded is-inline"></i>
                Free
              </li>
            </ul>
          </div>
          {poolsArray.map(([name, pool]) => {
            const freeBytes =
              pool.total - pool.allocated_tracked - pool.allocated_other;
            const total = formatBytes(pool.total, "B");
            const allocated = formatBytes(pool.allocated_tracked, "B");
            const free = formatBytes(freeBytes, "B");
            const other = formatBytes(pool.allocated_other, "B");

            return (
              <Fragment key={`storage-pool-${name}`}>
                <div className="storage-popover__row">
                  <div>
                    <div className="u-truncate" data-test="pool-name">
                      <strong>{name}</strong>
                    </div>
                    <div
                      className="u-text--light u-truncate"
                      data-test="pool-path"
                    >
                      {pool.path}
                    </div>
                  </div>
                  <div className="u-align--right">
                    <div data-test="pool-backend">{pool.backend}</div>
                    <div>{`${total.value}${total.unit}`}</div>
                  </div>
                  <Meter
                    className="u-no-margin--bottom"
                    data={[
                      {
                        color: COLOURS.LINK,
                        value: pool.allocated_tracked,
                      },
                      {
                        color: COLOURS.POSITIVE,
                        value: pool.allocated_other,
                      },
                      {
                        color: COLOURS.LINK_FADED,
                        value: freeBytes > 0 ? freeBytes : 0,
                      },
                    ]}
                    label={
                      <ul className="p-inline-list u-no-margin--bottom">
                        <li
                          className="p-inline-list__item"
                          data-test="pool-allocated"
                        >
                          <i className="p-circle--link is-inline"></i>
                          {`${allocated.value}${allocated.unit}`}
                        </li>
                        {showOthers && (
                          <li
                            className="p-inline-list__item"
                            data-test="pool-others"
                          >
                            <i className="p-circle--positive is-inline"></i>
                            {`${other.value}${other.unit}`}
                          </li>
                        )}
                        <li
                          className="p-inline-list__item"
                          data-test="pool-free"
                        >
                          <i className="p-circle--link-faded is-inline"></i>
                          {`${free.value}${free.unit}`}
                        </li>
                      </ul>
                    }
                    max={pool.total}
                  />
                </div>
              </Fragment>
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
