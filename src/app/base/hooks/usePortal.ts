import usePortalModule from "react-useportal";

type UsePortal = typeof usePortalModule;

// react-useportal is CommonJS with `exports.default`. Depending on the
// bundler's CJS interop, the default import is either the hook itself or the
// whole `module.exports` object (Vite 8 does the latter for ESM projects).
const usePortal: UsePortal =
  typeof usePortalModule === "function"
    ? usePortalModule
    : (usePortalModule as unknown as { default: UsePortal }).default;

export default usePortal;
