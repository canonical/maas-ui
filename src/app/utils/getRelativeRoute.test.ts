import { argPath } from "./argPath";
import { getRelativeRoute } from "./getRelativeRoute";

describe("getRelativeRoute", () => {
  it("can get a relative route from a simple route", () => {
    const urls = {
      index: "/machine",
      add: "/machine/add",
    };
    expect(getRelativeRoute(urls, "add")).toBe("/add");
  });

  it("can get a relative route from a simple index", () => {
    const urls = {
      index: "/machine",
      machine: argPath<{ id: number }>("/machine/:id"),
    };
    expect(getRelativeRoute(urls, "machine")).toBe("/:id");
  });

  it("can get a relative route from an index and route with args", () => {
    const urls = {
      index: argPath<{ id: number }>("/machine/:id/tests"),
      machine: argPath<{ id: number }>("/machine/:id/tests/:testid"),
    };
    expect(getRelativeRoute(urls, "machine")).toBe("/:testid");
  });

  it("can handle nested routes", () => {
    const urls = {
      index: "/machine",
      machine: {
        index: argPath<{ id: number }>("/machine/:id/"),
        tests: argPath<{ id: number }>("/machine/:id/tests"),
      },
    };
    expect(getRelativeRoute(urls, "machine")).toBe("/:testid");
  });

  it("handles routes without an index route", () => {
    const urls = {
      machine: argPath<{ id: number }>("/machine/:id"),
    };
    expect(getRelativeRoute(urls, "machine")).toBe("/machine/:id");
  });

  it("handles routes to the index if a route is not provided", () => {
    const urls = {
      index: argPath<{ id: number }>("/machine/:id/tests"),
    };
    expect(getRelativeRoute(urls)).toBe("/machine/:id/tests");
  });
});
