import { mount } from "enzyme";

import ScrollFade, {
  getScrollbarWidth,
  getShowFade,
  SCROLL_FADE_BUFFER,
} from "./ScrollFade";

describe("ScrollFade", () => {
  it("renders", () => {
    const wrapper = mount(<ScrollFade>Children</ScrollFade>);
    expect(wrapper).toMatchSnapshot();
  });

  describe("getScrollbarWidth", () => {
    it("correctly calculates an element's scrollbar width", () => {
      const scrollbarEl = { clientWidth: 80, offsetWidth: 100 } as HTMLElement;
      const noScrollbarEl = {
        clientWidth: 100,
        offsetWidth: 100,
      } as HTMLElement;
      expect(getScrollbarWidth(scrollbarEl)).toBe(20);
      expect(getScrollbarWidth(noScrollbarEl)).toBe(0);
    });
  });

  describe("getShowFade", () => {
    it("returns true if element is not scrolled to the bottom", () => {
      const el = {
        offsetHeight: 0,
        scrollHeight: 100,
        scrollTop: 50,
      } as HTMLElement;
      expect(getShowFade(el)).toBe(true);
    });

    it("returns false if element is scrolled to the bottom", () => {
      const el = {
        offsetHeight: 0,
        scrollHeight: 100,
        scrollTop: 100,
      } as HTMLElement;
      expect(getShowFade(el)).toBe(false);
    });

    it("returns false if element is scrolled within the buffer from the bottom", () => {
      const el = {
        offsetHeight: 0,
        scrollHeight: 100,
        scrollTop: 100 - SCROLL_FADE_BUFFER,
      } as HTMLElement;
      expect(getShowFade(el)).toBe(false);
    });
  });
});
