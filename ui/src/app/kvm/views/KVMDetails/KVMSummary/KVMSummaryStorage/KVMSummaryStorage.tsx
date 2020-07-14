import { Card, Col, Row } from "@canonical/react-components";
import React from "react";
import { useSelector } from "react-redux";

import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import { pod as podSelectors } from "app/base/selectors";
import { chunk, formatBytes } from "app/utils";
import Meter from "app/base/components/Meter";

type Props = { id: Pod["id"] };

const KVMSummaryStorage = ({ id }: Props): JSX.Element | null => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, Number(id))
  );

  if (!!pod) {
    const chunkedPools = chunk(pod.storage_pools, 3);

    return (
      <>
        {chunkedPools.map((pools, i) => (
          <Row key={`pool-chunk-${i}`}>
            {pools.map((pool) => {
              const available = formatBytes(pool.total - pool.used, "B");
              const used = formatBytes(pool.used, "B");

              return (
                <Col key={`storage-card-${pool.id}`} size="4">
                  <Card>
                    <div className="p-grid-list">
                      <div className="p-grid-list__label">Name</div>
                      <div className="p-grid-list__value">{pool.name}</div>
                      <div className="p-grid-list__label">Mount</div>
                      <div className="p-grid-list__value">{pool.path}</div>
                      <div className="p-grid-list__label">Type</div>
                      <div className="p-grid-list__value">{pool.type}</div>
                      <div className="p-grid-list__label">Space</div>
                      <div className="p-grid-list__value">
                        <Meter
                          className="u-no-margin--bottom"
                          data={[
                            {
                              key: `pool-${pool.id}-meter`,
                              value: pool.used,
                            },
                          ]}
                          label={
                            <>
                              <div>
                                <div>{`${used.value} ${used.unit}`}</div>
                                <div className="u-text--light">Used</div>
                              </div>
                              <div className="u-align--right">
                                <div>{`${available.value} ${available.unit}`}</div>
                                <div className="u-text--light">Available</div>
                              </div>
                            </>
                          }
                          max={pool.total}
                        />
                      </div>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        ))}
      </>
    );
  }
  return null;
};

export default KVMSummaryStorage;
