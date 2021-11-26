import type { ReactWrapper } from "enzyme";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";

import DebounceSearchBox, {
  DEFAULT_DEBOUNCE_INTERVAL,
} from "./DebounceSearchBox";

jest.useFakeTimers("modern");

describe("DebounceSearchBox", () => {
  const updateSearch = (wrapper: ReactWrapper, text: string) => {
    act(() => {
      wrapper.find("input[name='search']").simulate("change", {
        target: { name: "search", value: text },
      });
    });
    wrapper.update();
  };

  const advanceDebounceTimer = (wrapper: ReactWrapper) => {
    act(() => {
      jest.advanceTimersByTime(DEFAULT_DEBOUNCE_INTERVAL);
    });
    wrapper.update();
  };

  it(`runs onDebounced fn when the search text changes via the input, after the
      debounce interval`, () => {
    const onDebounced = jest.fn();
    const wrapper = mount(
      <DebounceSearchBox
        onDebounced={onDebounced}
        searchText="old-value"
        setSearchText={jest.fn()}
      />
    );

    updateSearch(wrapper, "new-value");
    expect(onDebounced).not.toHaveBeenCalled();

    advanceDebounceTimer(wrapper);
    expect(onDebounced).toHaveBeenCalledWith("new-value");
  });

  it(`does not run onDebounced fn when the search text changes via props, even
      after the debounce interval`, () => {
    const onDebounced = jest.fn();
    const Proxy = ({ searchText }: { searchText: string }) => (
      <DebounceSearchBox
        onDebounced={onDebounced}
        searchText={searchText}
        setSearchText={jest.fn()}
      />
    );
    const wrapper = mount(<Proxy searchText="old-value" />);

    wrapper.setProps({
      searchText: "new-value",
    });
    wrapper.update();
    expect(onDebounced).not.toHaveBeenCalled();

    advanceDebounceTimer(wrapper);
    expect(onDebounced).not.toHaveBeenCalled();
  });

  it("displays a spinner while debouncing search box input", () => {
    const wrapper = mount(
      <DebounceSearchBox
        onDebounced={jest.fn()}
        searchText="old-value"
        setSearchText={jest.fn()}
      />
    );
    const spinnerExists = () =>
      wrapper.find("[data-test='debouncing-spinner']").exists();
    expect(spinnerExists()).toBe(false);

    updateSearch(wrapper, "new-value");
    expect(spinnerExists()).toBe(true);

    advanceDebounceTimer(wrapper);
    expect(spinnerExists()).toBe(false);
  });
});
