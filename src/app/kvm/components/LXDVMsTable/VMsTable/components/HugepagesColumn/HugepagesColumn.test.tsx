import { render, screen } from "@testing-library/react";

import HugepagesColumn from "./HugepagesColumn";

describe("HugepagesColumn", () => {
  it("can show if a VM is backed by hugepages", () => {
    render(<HugepagesColumn hugepagesBacked={true} />);

    expect(screen.getByText(/Enabled/i)).toBeInTheDocument();
  });

  it("can show if a VM is not backed by hugepages", () => {
    render(<HugepagesColumn hugepagesBacked={false} />);

    expect(screen.queryByText(/Enabled/i)).not.toBeInTheDocument();
  });
});
