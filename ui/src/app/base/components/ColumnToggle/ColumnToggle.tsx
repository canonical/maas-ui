import type { ReactNode } from "react";
import { useRef } from "react";

import { Button } from "@canonical/react-components";
import classNames from "classnames";

type Props = {
  isExpanded: boolean;
  label: ReactNode;
  onClose: () => void;
  onOpen: () => void;
};

const ColumnToggle = ({
  isExpanded,
  label,
  onClose,
  onOpen,
}: Props): JSX.Element => {
  const buttonNode = useRef<HTMLButtonElement | null>(null);
  return (
    <Button
      appearance="link"
      className={classNames("column-toggle", {
        "is-active": isExpanded,
      })}
      inline
      onClick={() => {
        if (isExpanded) {
          onClose();
        } else {
          onOpen();
          // Delay the scroll check until the toggle is complete.
          window.requestAnimationFrame(() => {
            if (buttonNode.current) {
              const { top } = buttonNode.current.getBoundingClientRect();
              // When a section opens check that it does not get moved off screen,
              // and if it does, scroll it into view.
              if (window.scrollY + top < window.scrollY) {
                window.scrollTo(0, window.scrollY + top);
              }
            }
          });
        }
      }}
    >
      <span className="column-toggle__name" ref={buttonNode}>
        {label}
      </span>
    </Button>
  );
};

export default ColumnToggle;
