import { useState } from "react";

import DebounceSearchBox, {
  DEFAULT_DEBOUNCE_INTERVAL,
  Labels,
} from "./DebounceSearchBox";

import { userEvent, render, screen, waitFor } from "testing/utils";

describe("DebounceSearchBox", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it(`runs onDebounced fn when the search text changes via the input, after the
      debounce interval`, async () => {
    const onDebounced = vi.fn();
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
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    await user.clear(searchBox);
    await user.type(searchBox, "new-value");

    expect(onDebounced).not.toHaveBeenCalled();

    await waitFor(() => {
      vi.advanceTimersByTime(DEFAULT_DEBOUNCE_INTERVAL);
    });
    expect(onDebounced).toHaveBeenCalledWith("new-value");
  });

  it(`does not run onDebounced fn when the search text changes via props, even
      after the debounce interval`, async () => {
    const onDebounced = vi.fn();
    const Proxy = ({ searchText }: { searchText: string }) => (
      <DebounceSearchBox
        onDebounced={onDebounced}
        searchText={searchText}
        setSearchText={vi.fn()}
      />
    );
    const { rerender } = render(<Proxy searchText="old-value" />);

    expect(onDebounced).not.toHaveBeenCalled();

    rerender(<Proxy searchText="new-value" />);
    await waitFor(() => {
      vi.advanceTimersByTime(DEFAULT_DEBOUNCE_INTERVAL);
    });
    expect(onDebounced).not.toHaveBeenCalled();
  });

  it("displays a spinner while debouncing search box input", async () => {
    render(
      <DebounceSearchBox
        onDebounced={vi.fn()}
        searchText="old-value"
        setSearchText={vi.fn()}
      />
    );
    const searchBox = screen.getByRole("searchbox");
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    expect(
      screen.queryByRole("alert", { name: Labels.Loading })
    ).not.toBeInTheDocument();

    await user.clear(searchBox);
    expect(
      screen.getByRole("alert", { name: Labels.Loading })
    ).toBeInTheDocument();
    vi.advanceTimersByTime(DEFAULT_DEBOUNCE_INTERVAL);
    await waitFor(() => {
      expect(
        screen.queryByRole("alert", { name: Labels.Loading })
      ).not.toBeInTheDocument();
    });
  });
});
