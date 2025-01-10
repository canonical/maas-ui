import GroupRowActions from "./GroupRowActions";

import { render, userEvent, screen } from "@/testing/utils";

const getMockRow = (isExpanded: boolean) => {
  return {
    getIsExpanded: vi.fn(() => isExpanded),
    toggleExpanded: vi.fn(),
  };
};

it("calls toggleExpanded when button is clicked", async () => {
  const mockRow = getMockRow(true);
  // @ts-ignore
  render(<GroupRowActions row={mockRow} />);

  await userEvent.click(screen.getByRole("button"));
  expect(mockRow.toggleExpanded).toHaveBeenCalled();
});

it('displays "Collapse" when expanded', () => {
  const mockRow = getMockRow(true);
  // @ts-ignore
  render(<GroupRowActions row={mockRow} />);
  expect(screen.getByText("Collapse")).toBeInTheDocument();
});

it('displays "Expand" when not expanded', () => {
  const mockRow = getMockRow(false);
  // @ts-ignore
  render(<GroupRowActions row={mockRow} />);
  expect(screen.getByText("Expand")).toBeInTheDocument();
});
