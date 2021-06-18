import { renderHook } from "@testing-library/react-hooks";

import { useCycled, useScrollOnRender } from "./hooks";

describe("hooks", () => {
  describe("useScrollOnRender", () => {
    let html: HTMLElement;
    let scrollToSpy: jest.Mock;
    let targetNode: HTMLElement;

    beforeEach(() => {
      global.innerHeight = 500;
      html = document.querySelector("html");
      scrollToSpy = jest.fn();
      global.scrollTo = scrollToSpy;
      targetNode = document.createElement("div");
    });

    afterEach(() => {
      html.scrollTop = 0;
    });

    it("does not scroll if the target is on screen", () => {
      html.scrollTop = 10;
      const onRenderRef = renderHook(() => useScrollOnRender());
      targetNode.getBoundingClientRect = () => ({ y: 10 } as DOMRect);
      onRenderRef.result.current(targetNode);
      expect(scrollToSpy).not.toHaveBeenCalled();
    });

    it("scrolls if the target is off the bottom of the screen", () => {
      html.scrollTop = 100;
      const onRenderRef = renderHook(() => useScrollOnRender());
      targetNode.getBoundingClientRect = () => ({ y: 1000 } as DOMRect);
      onRenderRef.result.current(targetNode);
      expect(scrollToSpy).toHaveBeenCalledWith({
        top: 1000,
        left: 0,
        behavior: "smooth",
      });
    });

    it("scrolls if the target is off the top of the screen", () => {
      html.scrollTop = 1000;
      const onRenderRef = renderHook(() => useScrollOnRender());
      targetNode.getBoundingClientRect = () => ({ y: 10 } as DOMRect);
      onRenderRef.result.current(targetNode);
      expect(scrollToSpy).toHaveBeenCalledWith({
        top: 10,
        left: 0,
        behavior: "smooth",
      });
    });

    it("scrolls if the target is partially off the bottom of the screen", () => {
      html.scrollTop = 100;
      const onRenderRef = renderHook(() => useScrollOnRender());
      targetNode.getBoundingClientRect = () =>
        ({ height: 400, y: 400 } as DOMRect);
      onRenderRef.result.current(targetNode);
      expect(scrollToSpy).toHaveBeenCalledWith({
        top: 400,
        left: 0,
        behavior: "smooth",
      });
    });
  });

  describe("useCycled", () => {
    it("can handle the initial state", () => {
      const onCycled = jest.fn();
      const { result } = renderHook(() => useCycled(false, onCycled));
      expect(result.current).toBe(false);
      expect(onCycled).not.toHaveBeenCalled();
    });

    it("can handle rerenders when the value has not cycled", () => {
      const onCycled = jest.fn();
      const { result, rerender } = renderHook(
        ({ state }) => useCycled(state, onCycled),
        {
          initialProps: { state: false },
        }
      );
      rerender({ state: false });
      expect(result.current).toBe(false);
      expect(onCycled).not.toHaveBeenCalled();
    });

    it("can handle rerenders when the value has cycled", () => {
      const onCycled = jest.fn();
      const { result, rerender } = renderHook(
        ({ state }) => useCycled(state, onCycled),
        {
          initialProps: { state: false },
        }
      );
      rerender({ state: true });
      expect(result.current).toBe(true);
      expect(onCycled).toHaveBeenCalled();
    });
  });
});
