export const BASENAME = process.env.BASENAME;
export const LEGACY_BASENAME = process.env.LEGACY_BASENAME;
export const REACT_BASENAME = process.env.REACT_BASENAME;

export const generateLegacyURL = (route) =>
  `${BASENAME}${LEGACY_BASENAME}${route || ""}`;

export const generateNewURL = (route, appendBase = true) =>
  `${appendBase ? BASENAME : ""}${REACT_BASENAME}${route || ""}`;

export const generateBaseURL = (route) => `${BASENAME}${route || ""}`;

const pushRoute = (route) => window.history.pushState(null, null, route);

const navigate = (route, evt) => {
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

export const navigateToLegacy = (route, evt) => {
  navigate(generateLegacyURL(route), evt);
};

export const navigateToNew = (route, evt) => {
  navigate(generateNewURL(route), evt);
};

/**
 * Get the formatted power type from a power type description.
 * @param {String} description - A power type description.
 * @param {String} powerType - A power type.
 * @return {String} The formatted power type or the original power type key.
 */
export const extractPowerType = (description, powerType) => {
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
