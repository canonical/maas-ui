import { useFormikContext } from "formik";
import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

import type { ComposeFormValues, DiskField } from "../../ComposeForm";
import type { PodDetails } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import podSelectors from "app/store/pod/selectors";
import { formatBytes } from "app/utils";
import { COLOURS } from "app/base/constants";
import ContextualMenu from "app/base/components/ContextualMenu";
import Meter from "app/base/components/Meter";

type RequestMap = { [location: string]: number };

type SelectPool = (poolName?: string) => void;

type Props = {
  disk: DiskField;
  selectPool: SelectPool;
};

const normaliseBytes = (bytes: number): number =>
  formatBytes(bytes, "B", { convertTo: "GB" }).value;

const generateDropdownContent = (
  pod: PodDetails,
  disk: DiskField,
  requests: RequestMap,
  selectPool: SelectPool
): JSX.Element => {
  const sortedPools = [
    pod.storage_pools.find((pool) => pool.id === pod.default_storage_pool),
    ...pod.storage_pools.filter((pool) => pool.id !== pod.default_storage_pool),
  ].filter(Boolean);

  return (
    <>
      <div className="kvm-pool-select__header p-table__header">
        <div></div>
        <div>Storage</div>
        <div className="u-align--right">Type</div>
        <ul className="p-inline-list u-default-text u-no-margin--bottom">
          <li className="p-inline-list__item">
            <i className="p-circle--link is-inline"></i>
            Allocated
          </li>
          <li className="p-inline-list__item">
            <i className="p-circle--positive is-inline"></i>
            Requested
          </li>
          <li className="p-inline-list__item">
            <i className="p-circle--link-faded is-inline"></i>
            Free
          </li>
        </ul>
      </div>
      {sortedPools.map((pool) => {
        const isSelected = pool.name === disk.location;
        const isDefaultPool = pool.id === pod.default_storage_pool;

        // Normalise disk requests and pool storage values to GB.
        const available = normaliseBytes(pool.total - pool.used);
        const allocated = normaliseBytes(pool.used);
        const total = normaliseBytes(pool.total);
        const requested = requests[pool.name] || 0;
        const pendingRequest = isSelected ? 0 : disk.size;
        const free = available - requested - pendingRequest;

        return (
          <button
            className="kvm-pool-select__button p-button--base"
            disabled={free < 0}
            key={`${disk.id}-${pool.id}`}
            onClick={() => selectPool(pool.name)}
            type="button"
          >
            <div className="kvm-pool-select__row">
              <div>{isSelected && <i className="p-icon--tick"></i>}</div>
              <div>
                <strong>
                  {isDefaultPool ? `${pool.name} (default)` : pool.name}
                </strong>
                <br />
                <span className="u-text--light">{pool.path}</span>
              </div>
              <div className="u-align--right">
                {pool.type}
                <br />
                {`${total}GB`}
              </div>
              <Meter
                className="u-no-margin--bottom"
                data={[
                  {
                    color: COLOURS.LINK,
                    value: allocated,
                  },
                  {
                    color: COLOURS.POSITIVE,
                    value: requested,
                  },
                  {
                    color: COLOURS.POSITIVE_FADED,
                    value: pendingRequest,
                  },
                  {
                    color: COLOURS.LINK_FADED,
                    value: free >= 0 ? free : 0,
                  },
                ]}
                label={
                  free >= 0 ? (
                    <ul className="p-inline-list u-no-margin--bottom">
                      <li className="p-inline-list__item" data-test="allocated">
                        <i className="p-circle--link is-inline"></i>
                        {`${allocated}GB`}
                      </li>
                      {requested !== 0 && (
                        <li
                          className="p-inline-list__item"
                          data-test="requested"
                        >
                          <i className="p-circle--positive is-inline"></i>
                          {`${requested}GB`}
                        </li>
                      )}
                      <li className="p-inline-list__item" data-test="free">
                        <i className="p-circle--link-faded is-inline"></i>
                        {`${available - requested}GB`}
                      </li>
                    </ul>
                  ) : (
                    <div>
                      <i className="p-icon--warning is-inline"></i>
                      Only {available} GB available in {pool.name}.
                    </div>
                  )
                }
                max={total}
              />
            </div>
          </button>
        );
      })}
    </>
  );
};

export const PoolSelect = ({ disk, selectPool }: Props): JSX.Element => {
  const { id } = useParams();
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, Number(id))
  ) as PodDetails;
  const { values } = useFormikContext<ComposeFormValues>();

  const { disks } = values;
  const requests: RequestMap = disks.reduce((requests, disk) => {
    if (requests[disk.location]) {
      requests[disk.location] += disk.size;
    } else {
      requests[disk.location] = disk.size;
    }
    return requests;
  }, {});

  return (
    <ContextualMenu
      className="kvm-pool-select"
      constrainPanelWidth
      dropdownClassName="kvm-pool-select__dropdown"
      dropdownContent={generateDropdownContent(pod, disk, requests, selectPool)}
      hasToggleIcon
      position="left"
      toggleClassName="kvm-pool-select__toggle"
      toggleLabel={disk.location}
    />
  );
};

export default PoolSelect;
