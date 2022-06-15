import type { ArgPathArgs } from "./argPath";

type ArgPath<A extends ArgPathArgs> = (
  args: A | null,
  unmodified?: boolean
) => string;

type Routes<A extends ArgPathArgs> = {
  [route: string]: string | ArgPath<A> | Routes<A>;
};

const getPath = <A extends ArgPathArgs>(
  routes: Routes<A>,
  route: keyof Routes<A>
): string | null => {
  if (!(route in routes)) {
    return null;
  }
  const path = routes[route];
  if (path && typeof path === "object") {
    return getPath(path, "index");
  }
  return typeof path === "string" ? path : path(null, true);
};

/**
 * Returns a relative route using the index of the routes object.
 * @param routes - A collection of urls containing an index and the route you
 * want to return.
 * @param route - A route key on the routes object.
 * @returns A relative route.
 */
export const getRelativeRoute = <A extends ArgPathArgs>(
  routes: Routes<A>,
  route: keyof Routes<A> = "index"
): string => {
  const index = getPath(routes, "index") || "";
  const fullPath = getPath(routes, route) || "";
  return fullPath.replace(index, "");
};
