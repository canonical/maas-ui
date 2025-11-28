import { render, screen } from "@testing-library/react";

import CoresColumn from "./CoresColumn";

describe("CoresColumn", () => {
  it("can show the pinned cores of a VM", () => {
    render(<CoresColumn pinnedCores={[0, 1, 2, 4]} unpinnedCores={0} />);
    expect(screen.getByText(/0-2, 4/i)).toBeInTheDocument();
    expect(screen.getByText(/pinned/i)).toBeInTheDocument();
  });

  it("can show the unpinned cores of a VM", () => {
    render(<CoresColumn pinnedCores={[]} unpinnedCores={4} />);
    expect(screen.getByText(/Any 4/i)).toBeInTheDocument();
    expect(screen.queryByText(/pinned/i)).toBeNull();
  });
});
