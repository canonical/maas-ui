import DiskBootStatus from "./DiskBootStatus";

import { DiskTypes } from "app/store/types/enum";
import { nodeDisk as diskFactory } from "testing/factories";
import { render, screen } from "testing/utils";

describe("DiskBootStatus", () => {
  it("shows boot status for boot disks", () => {
    const disk = diskFactory({ is_boot: true, type: DiskTypes.PHYSICAL });
    render(<DiskBootStatus disk={disk} />);

    const icon = screen.getByLabelText("Boot disk");
    expect(icon).toHaveClass("p-icon--tick");
  });

  it("shows boot status for non-boot disks", () => {
    const disk = diskFactory({ is_boot: false, type: DiskTypes.PHYSICAL });
    render(<DiskBootStatus disk={disk} />);

    const icon = screen.getByLabelText("Non-boot disk");
    expect(icon).toHaveClass("p-icon--close");
  });

  it("shows boot status for non-physical disks", () => {
    const disk = diskFactory({ is_boot: false, type: DiskTypes.VIRTUAL });
    render(<DiskBootStatus disk={disk} />);

    expect(screen.getByText("—")).toBeInTheDocument();
  });
});
