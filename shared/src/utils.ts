import type React from "react";
import type { MutableRefObject } from "react";
import { useEffect, useRef, useCallback } from "react";

import { nanoid } from "nanoid";

export const BASENAME = process.env.BASENAME;
export const LEGACY_BASENAME = process.env.LEGACY_BASENAME;
export const REACT_BASENAME = process.env.REACT_BASENAME;

export type Route = string;

export const generateLegacyURL = (route?: Route): string =>
  `${BASENAME}${LEGACY_BASENAME}${route || ""}`;

export const generateNewURL = (route?: Route, appendBase = true): string =>
  `${appendBase ? BASENAME : ""}${REACT_BASENAME}${route || ""}`;

export const generateBaseURL = (route?: Route): string =>
  `${BASENAME}${route || ""}`;

const pushRoute = (route: Route) => window.history.pushState(null, null, route);

const navigate = (route: Route, evt?: MouseEvent | React.MouseEvent) => {
  if (evt) {
    // Handle ctrl/command/middle clicking etc. the links to open in a new tab.
    // Inspired by how this is handled in react-router:
    // https://github.com/ReactTraining/react-router/blob/f466c8c4156b6fcdb6baf4fcc723758f7eceeb4b/packages/react-router-dom/modules/Link.js#L43
    const isLeftClick = evt.button === 0;
    const hasModifierKey =
      evt.metaKey || evt.altKey || evt.ctrlKey || evt.shiftKey;
    if (isLeftClick && !hasModifierKey) {
      evt.preventDefault();
      pushRoute(route);
    }
  } else {
    // If there is no event (e.g. for a redirect) then navigate directly.
    pushRoute(route);
  }
};

export const navigateToLegacy = (
  route?: Route,
  evt?: MouseEvent | React.MouseEvent
): void => {
  navigate(generateLegacyURL(route), evt);
};

export const navigateToNew = (
  route?: Route,
  evt?: MouseEvent | React.MouseEvent
): void => {
  navigate(generateNewURL(route), evt);
};

/**
 * Get the formatted power type from a power type description.
 * @param description - A power type description.
 * @param powerType - A power type.
 * @return The formatted power type or the original power type key.
 */
export const extractPowerType = (
  description: string,
  powerType: string
): string => {
  if (!powerType) {
    return null;
  }

  if (!description) {
    return powerType;
  }

  const position = description.toLowerCase().indexOf(powerType.toLowerCase());
  return position === -1
    ? powerType
    : description.substring(position, position + powerType.length);
};

/**
 * Get a random ID string
 * @returns non-secure random ID string
 */
export const useId = (): string => useRef(nanoid()).current;

/**
 * Handle clicks outside an element.
 * @returns An id and ref to pass to the element to handle clicks
 * outside of.
 */
export const useClickOutside = <E extends HTMLElement>(
  onClickOutside: () => void
): [MutableRefObject<E>, string] => {
  const wrapperRef = useRef<E | null>(null);
  const id = useId();

  const handleClickOutside = useCallback(
    (evt: MouseEvent) => {
      const target = evt.target as HTMLElement;
      // The target might be something like an SVG node which doesn't provide
      // the class name as a string.
      const isValidTarget =
        typeof (evt?.target as HTMLElement)?.className === "string";
      if (
        !isValidTarget ||
        (wrapperRef.current &&
          !wrapperRef.current?.contains(target) &&
          target.id !== id)
      ) {
        onClickOutside();
      }
    },
    [id, onClickOutside]
  );

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
    return () =>
      document.removeEventListener("click", handleClickOutside, false);
  }, [handleClickOutside]);
  return [wrapperRef, id];
};
