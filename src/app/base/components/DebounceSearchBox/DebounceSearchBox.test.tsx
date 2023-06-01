import { useState } from "react";

import DebounceSearchBox, {
  DEFAULT_DEBOUNCE_INTERVAL,
  Labels,
} from "./DebounceSearchBox";

import { userEvent, render, screen, waitFor } from "testing/utils";

describe("DebounceSearchBox", () => {
  beforeEach(() => {
    jest.useFakeTimers("modern");
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it(`runs onDebounced fn when the search text changes via the input, after the
      debounce interval`, async () => {
    const onDebounced = jest.fn();
    const Proxy = () => {
      const [searchText, setSearchText] = useState("old-value");
      return (
        <DebounceSearchBox
          onDebounced={onDebounced}
          searchText={searchText}
          setSearchText={setSearchText}
        />
      );
    };
    render(<Proxy />);
    const searchBox = screen.getByRole("searchbox");
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    await user.clear(searchBox);
    await user.type(searchBox, "new-value");

    expect(onDebounced).not.toHaveBeenCalled();

    await waitFor(() => {
      jest.advanceTimersByTime(DEFAULT_DEBOUNCE_INTERVAL);
    });
    expect(onDebounced).toHaveBeenCalledWith("new-value");
  });

  it(`does not run onDebounced fn when the search text changes via props, even
      after the debounce interval`, async () => {
    const onDebounced = jest.fn();
    const Proxy = ({ searchText }: { searchText: string }) => (
      <DebounceSearchBox
        onDebounced={onDebounced}
        searchText={searchText}
        setSearchText={jest.fn()}
      />
    );
    const { rerender } = render(<Proxy searchText="old-value" />);

    expect(onDebounced).not.toHaveBeenCalled();

    rerender(<Proxy searchText="new-value" />);
    await waitFor(() => {
      jest.advanceTimersByTime(DEFAULT_DEBOUNCE_INTERVAL);
    });
    expect(onDebounced).not.toHaveBeenCalled();
  });

  it("displays a spinner while debouncing search box input", async () => {
    render(
      <DebounceSearchBox
        onDebounced={jest.fn()}
        searchText="old-value"
        setSearchText={jest.fn()}
      />
    );
    const searchBox = screen.getByRole("searchbox");
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    expect(
      screen.queryByRole("alert", { name: Labels.Loading })
    ).not.toBeInTheDocument();

    await user.clear(searchBox);
    expect(
      screen.getByRole("alert", { name: Labels.Loading })
    ).toBeInTheDocument();

    await waitFor(() => {
      jest.advanceTimersByTime(DEFAULT_DEBOUNCE_INTERVAL);
    });
    expect(
      screen.queryByRole("alert", { name: Labels.Loading })
    ).not.toBeInTheDocument();
  });
});
