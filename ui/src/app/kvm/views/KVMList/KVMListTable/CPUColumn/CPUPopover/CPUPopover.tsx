import PropTypes from "prop-types";
import React, { useRef } from "react";
import usePortal from "react-useportal";

const getPositionStyle = (
  el: React.MutableRefObject<Element | null>
): React.CSSProperties => {
  if (!el || !el.current) {
    return {};
  }

  const dimensions = el.current.getBoundingClientRect();
  const { x, y, height } = dimensions;
  const left = x - 16 + window.scrollX || 0;
  const top = y + height + window.scrollY || 0;

  return { position: "absolute", left, top };
};

type Props = {
  assigned: number;
  children: JSX.Element | string;
  physical: number;
  overcommit: number;
};

const CPUPopover = ({
  assigned,
  children,
  physical,
  overcommit,
}: Props): JSX.Element => {
  const el = useRef(null);
  const { openPortal, closePortal, isOpen, Portal } = usePortal();
  const positionStyle = getPositionStyle(el);
  const total = physical * overcommit;
  const unassigned = total - assigned;

  return (
    <>
      <div
        onBlur={closePortal}
        onFocus={openPortal}
        onMouseOut={closePortal}
        onMouseOver={openPortal}
        ref={el}
      >
        {children}
        {isOpen && (
          <Portal>
            <div className="cpu-popover" style={positionStyle}>
              <div className="cpu-popover__primary">
                <div className="cpu-popover__row">
                  <div className="cpu-popover__value" data-test="assigned">
                    <div className="cpu-popover__assigned" />
                    {assigned}
                  </div>
                  <div className="cpu-popover__label">Assigned</div>
                </div>
                <div className="cpu-popover__row">
                  <div className="cpu-popover__value" data-test="unassigned">
                    <div className="cpu-popover__unassigned" />
                    {unassigned}
                  </div>
                  <div className="cpu-popover__label">Unassigned</div>
                </div>
              </div>
              <div className="cpu-popover__secondary">
                <div className="cpu-popover__row">
                  <div className="cpu-popover__value" data-test="physical">
                    {physical}
                  </div>
                  <div className="cpu-popover__label">{`Physical core${
                    physical === 1 ? "" : "s"
                  }`}</div>
                </div>
                <div className="cpu-popover__row">
                  <div className="cpu-popover__value">
                    &times;&nbsp;&nbsp;
                    <span data-test="overcommit">{overcommit}</span>
                  </div>
                  <div className="cpu-popover__label">Overcommit ratio</div>
                </div>
                <hr className="u-sv1" />
                <div className="cpu-popover__row">
                  <div className="cpu-popover__value" data-test="total">
                    {total}
                  </div>
                  <div className="cpu-popover__label">Total</div>
                </div>
              </div>
            </div>
          </Portal>
        )}
      </div>
    </>
  );
};

CPUPopover.propTypes = {
  assigned: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  physical: PropTypes.number.isRequired,
  overcommit: PropTypes.number.isRequired,
};

export default CPUPopover;
