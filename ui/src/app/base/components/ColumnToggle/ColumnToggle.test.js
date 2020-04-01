import { mount, shallow } from "enzyme";
import React from "react";

import ColumnToggle from "./ColumnToggle";

describe("ColumnToggle ", () => {
  it("renders", () => {
    const wrapper = shallow(
      <ColumnToggle
        isExpanded={false}
        label="maas.local"
        onClose={jest.fn()}
        onOpen={jest.fn()}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("calls the close function when expanded", () => {
    const onClose = jest.fn();
    const wrapper = shallow(
      <ColumnToggle
        isExpanded={true}
        label="maas.local"
        onClose={onClose}
        onOpen={jest.fn()}
      />
    );
    wrapper.simulate("click");
    expect(onClose).toHaveBeenCalled();
  });

  it("calls the open function when not expanded", () => {
    const onOpen = jest.fn();
    const wrapper = shallow(
      <ColumnToggle
        isExpanded={false}
        label="maas.local"
        onClose={jest.fn()}
        onOpen={onOpen}
      />
    );
    wrapper.simulate("click");
    expect(onOpen).toHaveBeenCalled();
  });

  describe("scroll ", () => {
    beforeEach(() => {
      jest
        .spyOn(window, "requestAnimationFrame")
        .mockImplementation((cb) => cb());
      window.scrollTo = jest.fn();
      window.scrollY = 100;
    });

    afterEach(() => {
      window.requestAnimationFrame.mockRestore();
      window.scrollTo.mockRestore();
      window.scrollY = 0;
    });

    it("can scroll to a toggle", () => {
      Element.prototype.getBoundingClientRect = jest.fn(() => ({ top: -20 }));
      const wrapper = mount(
        <ColumnToggle
          isExpanded={false}
          label="maas.local"
          onClose={jest.fn()}
          onOpen={jest.fn()}
        />
      );
      wrapper.simulate("click");
      expect(window.scrollTo).toHaveBeenCalled();
      expect(window.scrollTo.mock.calls[0][1]).toBe(80);
    });

    it("does not scroll if the toggle is visible", () => {
      Element.prototype.getBoundingClientRect = jest.fn(() => ({ top: 20 }));
      const wrapper = mount(
        <ColumnToggle
          isExpanded={false}
          label="maas.local"
          onClose={jest.fn()}
          onOpen={jest.fn()}
        />
      );
      wrapper.simulate("click");
      expect(window.scrollTo).not.toHaveBeenCalled();
    });
  });
});
