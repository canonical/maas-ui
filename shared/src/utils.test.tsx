import type { PropsWithChildren } from "react";
import React from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  extractPowerType,
  generateBaseURL,
  generateLegacyURL,
  generateNewURL,
  navigateToLegacy,
  navigateToNew,
  useClickOutside,
} from "./utils";

describe("utils", () => {
  let pushState: jest.SpyInstance;

  beforeEach(() => {
    pushState = jest.spyOn(window.history, "pushState");
  });

  afterEach(() => {
    pushState.mockRestore();
  });

  describe("generateBaseURL", () => {
    it("can generate base urls", () => {
      expect(generateBaseURL("/api")).toBe("/MAAS/api");
    });

    it("can generate base urls without a route", () => {
      expect(generateBaseURL()).toBe("/MAAS");
    });
  });

  describe("generateLegacyURL", () => {
    it("can generate legacy urls", () => {
      expect(generateLegacyURL("/subnets")).toBe("/MAAS/l/subnets");
    });

    it("can generate base legacy urls", () => {
      expect(generateLegacyURL()).toBe("/MAAS/l");
    });
  });

  describe("generateNewURL", () => {
    it("can generate react urls", () => {
      expect(generateNewURL("/machines")).toBe("/MAAS/r/machines");
    });

    it("can generate base react urls", () => {
      expect(generateNewURL()).toBe("/MAAS/r");
    });

    it("can generate react urls without a base", () => {
      expect(generateNewURL("/machines", false)).toBe("/r/machines");
    });
  });

  describe("navigateToLegacy", () => {
    it("can navigate to legacy routes", () => {
      navigateToLegacy("/subnets");
      expect(pushState).toHaveBeenCalledWith(null, null, "/MAAS/l/subnets");
    });
  });

  describe("navigateToNew", () => {
    it("can navigate to react routes", () => {
      navigateToNew("/machines");
      expect(pushState).toHaveBeenCalledWith(null, null, "/MAAS/r/machines");
    });

    it("can navigate to react routes", () => {
      navigateToNew("/machines");
      expect(pushState).toHaveBeenCalledWith(null, null, "/MAAS/r/machines");
    });

    it("prevents default if this is a normal click", () => {
      const preventDefault = jest.fn();
      const mouseEvent = new MouseEvent("click", { button: 0 });
      mouseEvent.preventDefault = preventDefault;
      navigateToNew("/machines", mouseEvent);
      expect(pushState).toHaveBeenCalledWith(null, null, "/MAAS/r/machines");
      expect(preventDefault).toHaveBeenCalled();
    });

    it("does not navigate if this not a left click", () => {
      const preventDefault = jest.fn();
      const mouseEvent: MouseEvent = new MouseEvent("click", { button: 1 });
      mouseEvent.preventDefault = preventDefault;
      navigateToNew("/machines", mouseEvent);
      expect(pushState).not.toHaveBeenCalled();
      expect(preventDefault).not.toHaveBeenCalled();
    });

    it("does not navigate if a modifier key is pressed", () => {
      const preventDefault = jest.fn();
      const mouseEvent: MouseEvent = new MouseEvent("click", {
        button: 0,
        metaKey: true,
      });
      mouseEvent.preventDefault = preventDefault;
      navigateToNew("/machines", mouseEvent);
      expect(pushState).not.toHaveBeenCalled();
      expect(preventDefault).not.toHaveBeenCalled();
    });
  });

  describe("extractPowerType", () => {
    it("can extract a power type from a description", () => {
      expect(extractPowerType("The OpenBMC Power Driver", "openbmc")).toBe(
        "OpenBMC"
      );
    });

    it("handles no matching power type", () => {
      expect(extractPowerType("Open BMC Power Driver", "openbmc")).toBe(
        "openbmc"
      );
    });

    it("handles no description", () => {
      expect(extractPowerType(null, "openbmc")).toBe("openbmc");
    });
  });

  describe("useClickOutside", () => {
    const TestComponent = ({
      children,
      onClickOutside,
    }: PropsWithChildren<{
      onClickOutside: () => void;
    }>) => {
      const [wrapperRef, id] = useClickOutside<HTMLDivElement>(onClickOutside);
      return (
        <div>
          <div id={id} ref={wrapperRef}>
            Menu
            <button>Inside</button>
          </div>
          <button>Outside</button>
          {children}
        </div>
      );
    };

    it("handles clicks outside the target", async () => {
      const onClickOutside = jest.fn();
      render(<TestComponent onClickOutside={onClickOutside} />);
      await userEvent.click(screen.getByRole("button", { name: "Outside" }));
      expect(onClickOutside).toHaveBeenCalled();
    });

    it("handles clicks inside the target", async () => {
      const onClickOutside = jest.fn();
      render(<TestComponent onClickOutside={onClickOutside} />);
      await userEvent.click(screen.getByRole("button", { name: "Inside" }));
      expect(onClickOutside).not.toHaveBeenCalled();
    });

    it("handles clicking on elements that don't have string classNames", async () => {
      const onClickOutside = jest.fn();
      render(
        <TestComponent onClickOutside={onClickOutside}>
          <svg data-testid="no-classname" />
        </TestComponent>
      );
      await userEvent.click(screen.getByTestId("no-classname"));
      expect(onClickOutside).toHaveBeenCalled();
    });
  });
});
