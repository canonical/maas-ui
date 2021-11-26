import { useEffect, useRef, useState } from "react";

import type { SearchBoxProps } from "@canonical/react-components";
import { Icon, SearchBox } from "@canonical/react-components";
import classNames from "classnames";

type Props = {
  debounceInterval?: number;
  onDebounced: (debouncedText: string) => void;
  searchText: string;
  setSearchText: (searchText: string) => void;
} & Omit<SearchBoxProps, "externallyControlled" | "onChange" | "value">;

export const DEFAULT_DEBOUNCE_INTERVAL = 500;

const DebounceSearchBox = ({
  debounceInterval = DEFAULT_DEBOUNCE_INTERVAL,
  onDebounced,
  searchText,
  setSearchText,
}: Props): JSX.Element => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [debouncing, setDebouncing] = useState(false);

  // Clear the timeout when the component is unmounted.
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="debounce-search-box">
      <SearchBox
        externallyControlled
        onChange={(text: string) => {
          setDebouncing(true);
          setSearchText(text);
          // Clear the previous timeout.
          if (intervalRef.current) {
            clearTimeout(intervalRef.current);
          }
          intervalRef.current = setTimeout(() => {
            onDebounced(text);
            setDebouncing(false);
          }, debounceInterval);
        }}
        value={searchText}
      />
      {debouncing && (
        <div
          className={classNames(
            "debounce-search-box__spinner-container u-vertically-center",
            { "nudge-left": !!searchText }
          )}
          data-test="debouncing-spinner"
        >
          <Icon className="u-animation--spin" name="spinner" />
        </div>
      )}
    </div>
  );
};

export default DebounceSearchBox;
