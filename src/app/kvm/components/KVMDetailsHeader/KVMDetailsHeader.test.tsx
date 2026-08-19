import KVMDetailsHeader from "./KVMDetailsHeader";

import { screen, renderWithProviders } from "@/testing/utils";

describe("KVMDetailsHeader", () => {
  it("renders extra title blocks", () => {
    renderWithProviders(
      <KVMDetailsHeader
        tabLinks={[]}
        title="Title"
        titleBlocks={[{ title: "Title", subtitle: "Subtitle" }]}
      />,
      {
        initialEntries: ["/kvm/1"],
      }
    );
    expect(screen.getByTestId("extra-title-block")).toBeInTheDocument();
  });
});
