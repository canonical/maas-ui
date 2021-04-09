import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { useListener } from "@canonical/react-components/dist/hooks";
import classNames from "classnames";

// Max distance from bottom scroll position in which to remove fade.
export const SCROLL_FADE_BUFFER = 4;

export const getScrollbarWidth = (el: HTMLElement | null): number => {
  if (el) {
    const { clientWidth, offsetWidth } = el;
    const scrollbarWidth = offsetWidth - clientWidth;
    return scrollbarWidth >= 0 ? scrollbarWidth : 0;
  }
  return 0;
};

export const getShowFade = (el: HTMLElement | null): boolean => {
  if (el) {
    const { offsetHeight, scrollHeight, scrollTop } = el;
    const fromBottom = scrollHeight - scrollTop - offsetHeight;
    return fromBottom > SCROLL_FADE_BUFFER;
  }
  return false;
};

type Props = {
  children: ReactNode;
};

const ScrollFade = ({ children }: Props): JSX.Element => {
  const ref = useRef(null);
  const [showFade, setShowFade] = useState(false);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const onScroll = useCallback(() => {
    setScrollbarWidth(getScrollbarWidth(ref.current));
    setShowFade(getShowFade(ref.current));
  }, [ref]);

  // Initialise whether to show fade and attach scroll listener.
  useEffect(() => onScroll(), [onScroll]);
  useListener(ref.current, onScroll, "scroll", true, true);

  return (
    <div className="scroll-fade">
      <div
        className={classNames("scroll-fade__children", {
          "scroll-fade__children--scrollbar": scrollbarWidth !== 0,
        })}
        ref={ref}
      >
        {children}
      </div>
      {showFade && (
        <div
          className="scroll-fade__overlay"
          data-test="overlay"
          style={{ right: scrollbarWidth }}
        />
      )}
    </div>
  );
};

export default ScrollFade;
