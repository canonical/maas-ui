import { Card, Spinner } from "@canonical/react-components";
import React from "react";
import { useSelector } from "react-redux";

import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import podSelectors from "app/store/pod/selectors";
import { formatBytes } from "app/utils";
import KVMMeter from "app/kvm/components/KVMMeter";

type Props = { id: Pod["id"] };

const KVMStorage = ({ id }: Props): JSX.Element | null => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, Number(id))
  );

  if (!!pod) {
    const sortedPools = [...pod.storage_pools].sort((a, b) => {
      if (a.id === pod.default_storage_pool || b.id > a.id) {
        return -1;
      }
      if (b.id === pod.default_storage_pool || a.id > b.id) {
        return 1;
      }
      return 0;
    });

    return (
      <>
        <h4 className="u-sv1">
          Storage&nbsp;
          <span className="p-text--paragraph u-text--light">
            (Sorted by id, default first)
          </span>
        </h4>
        <div className="kvm-storage-grid">
          {sortedPools.map((pool) => {
            const total = formatBytes(pool.total, "B");
            const allocated = formatBytes(pool.used, "B", {
              convertTo: total.unit,
            });
            const free = formatBytes(pool.total - pool.used, "B", {
              convertTo: total.unit,
            });

            return (
              <Card className="u-no-padding--bottom" key={pool.id}>
                <h5>
                  <span data-test="pool-name">{pool.name}</span>
                  <br />
                  <span className="p-text--paragraph u-text--light">
                    {pool.path}
                  </span>
                </h5>
                <hr />
                <div className="kvm-storage-meter-grid">
                  <div>
                    <p className="p-heading--small u-text--light">Type</p>
                    <div>{pool.type}</div>
                  </div>
                  <KVMMeter
                    allocated={allocated.value}
                    free={free.value}
                    total={total.value}
                    unit={total.unit}
                  />
                </div>
              </Card>
            );
          })}
        </div>
      </>
    );
  }
  return <Spinner text="Loading" />;
};

export default KVMStorage;
