import userEvent from "@testing-library/user-event";

import ColumnToggle from "./ColumnToggle";

import { render, screen } from "testing/utils";

const DOM_RECT = {
  height: 0,
  width: 0,
  x: 0,
  y: 0,
  bottom: 0,
  left: 0,
  right: 0,
  toJSON: jest.fn(),
};

describe("ColumnToggle ", () => {
  beforeEach(() => {
    jest.spyOn(window, "scrollTo");
  });

  it("calls the close function when expanded", async () => {
    const onClose = jest.fn();
    render(
      <ColumnToggle
        isExpanded={true}
        label="maas.local"
        onClose={onClose}
        onOpen={jest.fn()}
      />
    );

    await userEvent.click(screen.getByRole("button"));

    expect(onClose).toHaveBeenCalled();
  });

  it("calls the open function when not expanded", async () => {
    const onOpen = jest.fn();
    render(
      <ColumnToggle
        isExpanded={false}
        label="maas.local"
        onClose={jest.fn()}
        onOpen={onOpen}
      />
    );

    await userEvent.click(screen.getByRole("button"));

    expect(onOpen).toHaveBeenCalled();
  });

  describe("scroll", () => {
    beforeEach(() => {
      jest
        .spyOn(window, "requestAnimationFrame")
        .mockImplementation((cb: FrameRequestCallback) => {
          cb(0);
          return 0;
        });
      Object.defineProperty(window, "scrollY", { value: 100 });
    });

    afterEach(() => {
      jest.restoreAllMocks();
      Object.defineProperty(window, "scrollY", { value: 0 });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("can scroll to a toggle", async () => {
      Element.prototype.getBoundingClientRect = jest.fn(() => ({
        ...DOM_RECT,
        top: -20,
      }));
      render(
        <ColumnToggle
          isExpanded={false}
          label="maas.local"
          onClose={jest.fn()}
          onOpen={jest.fn()}
        />
      );

      await userEvent.click(screen.getByRole("button"));

      expect(window.scrollTo).toHaveBeenCalledWith(0, 80);
    });

    it("does not scroll if the toggle is visible", async () => {
      Element.prototype.getBoundingClientRect = jest.fn(() => ({
        ...DOM_RECT,
        top: 20,
      }));
      render(
        <ColumnToggle
          isExpanded={false}
          label="maas.local"
          onClose={jest.fn()}
          onOpen={jest.fn()}
        />
      );

      await userEvent.click(screen.getByRole("button"));

      expect(window.scrollTo).not.toHaveBeenCalled();
    });
  });
});
