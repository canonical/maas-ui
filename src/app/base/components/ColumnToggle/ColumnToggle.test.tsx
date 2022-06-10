import { mount, shallow } from "enzyme";

import ColumnToggle from "./ColumnToggle";

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

    it("can scroll to a toggle", () => {
      Element.prototype.getBoundingClientRect = jest.fn(() => ({
        ...DOM_RECT,
        top: -20,
      }));
      const wrapper = mount(
        <ColumnToggle
          isExpanded={false}
          label="maas.local"
          onClose={jest.fn()}
          onOpen={jest.fn()}
        />
      );
      wrapper.simulate("click");
      expect(window.scrollTo).toHaveBeenCalledWith(0, 80);
    });

    it("does not scroll if the toggle is visible", () => {
      Element.prototype.getBoundingClientRect = jest.fn(() => ({
        ...DOM_RECT,
        top: 20,
      }));
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
