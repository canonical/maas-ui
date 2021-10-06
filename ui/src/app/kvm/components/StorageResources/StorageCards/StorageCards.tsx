import { useCallback, useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

import { useListener } from "@canonical/react-components/dist/hooks";

import { COLOURS } from "app/base/constants";
import StoragePopover from "app/kvm/views/KVMList/StorageColumn/StoragePopover";
import type { PodStoragePool } from "app/store/pod/types";

type Props = {
  pools: PodStoragePool[];
};
type CardSize = "small" | "medium" | "large";

const MIN_ASPECT_RATIO = 0.85;
const SMALL_CARD_HEIGHT = 35;
export const SMALL_MIN_WIDTH = Math.ceil(SMALL_CARD_HEIGHT * MIN_ASPECT_RATIO);
export const MEDIUM_MIN_WIDTH = SMALL_MIN_WIDTH * 1.5;
export const LARGE_MIN_WIDTH = SMALL_MIN_WIDTH * 3;

export const updateCardSize = (
  width: number,
  numCards: number,
  setCardSize: Dispatch<SetStateAction<CardSize>>
): void => {
  if (width >= numCards * LARGE_MIN_WIDTH) {
    setCardSize("large");
  } else if (width * 2 >= numCards * MEDIUM_MIN_WIDTH) {
    setCardSize("medium");
  } else {
    setCardSize("small");
  }
};

const StorageCards = ({ pools }: Props): JSX.Element | null => {
  const [cardSize, setCardSize] = useState<CardSize>("small");
  const el = useRef<HTMLDivElement>(null);
  const onResize = useCallback(() => {
    if (el?.current?.offsetWidth) {
      updateCardSize(el?.current?.offsetWidth, pools.length, setCardSize);
    }
  }, [pools.length]);
  useEffect(onResize, [onResize]);
  useListener(window, onResize, "resize", true);

  return (
    <div className={`storage-cards--${cardSize}`} ref={el}>
      {pools.map((pool, i) => {
        const allocatedWidth = (pool.used / pool.total) * 100;

        return (
          <StoragePopover key={pool.id} pools={[pool]}>
            <div className="storage-card-container">
              <div className="storage-card">
                <div className="storage-card__index u-align--right">#{i}</div>
                <div
                  className="storage-card__meter"
                  data-test="storage-card-meter"
                  style={{
                    backgroundImage: `linear-gradient(
                      to right,
                      ${COLOURS.LINK} 0,
                      ${COLOURS.LINK} ${allocatedWidth}%,
                      ${COLOURS.LINK_FADED} ${allocatedWidth}%,
                      ${COLOURS.LINK_FADED} 100%
                    )`,
                  }}
                ></div>
              </div>
            </div>
          </StoragePopover>
        );
      })}
    </div>
  );
};

export default StorageCards;
