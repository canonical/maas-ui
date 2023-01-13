import { useState, useRef } from "react";
import type { ReactNode } from "react";

import classNames from "classnames";
import { Portal } from "react-portal";

type Props = {
  children: ReactNode;
  className?: string;
  content?: ReactNode;
  position?: "left" | "right";
};

const getPositionStyle = (
  el: React.MutableRefObject<Element | null>,
  position: Props["position"]
) => {
  if (!el?.current) {
    return {};
  }

  const dimensions = el.current.getBoundingClientRect();
  const { height, left, right, top } = dimensions;
  const styles: {
    position: string;
    top: number;
    left: number | null;
    right: number | null;
  } = {
    position: "absolute",
    top: top + height + window.scrollY || 0,
    left: null,
    right: null,
  };

  if (position === "left") {
    styles.left = left + window.scrollX || 0;
  } else {
    styles.right = window.innerWidth + window.scrollX - right || 0;
  }
  return styles;
};

const Popover = ({
  children,
  className,
  content,
  position = "right",
}: Props): JSX.Element => {
  const el = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const closePortal = () => setIsOpen(false);
  const openPortal = () => setIsOpen(true);
  const positionStyle = getPositionStyle(el, position);

  return (
    <div
      data-testid="popover-container"
      onBlur={closePortal}
      onFocus={openPortal}
      onMouseOut={closePortal}
      onMouseOver={openPortal}
      ref={el}
    >
      {children}
      {isOpen && content && (
        <Portal>
          <div
            className={classNames("p-popover", className)}
            style={positionStyle}
          >
            {content}
          </div>
        </Portal>
      )}
    </div>
  );
};

export default Popover;
