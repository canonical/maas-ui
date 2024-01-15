import ErrorDetails from "./ErrorDetails";

import { renderWithMockStore, screen } from "@/testing/utils";

const errorMessage = "error message text";
const failedSystemIds = ["abc123", "def456"];
const failureDetails = {
  [errorMessage]: failedSystemIds,
};

it("displays correct count of failed machines", () => {
  renderWithMockStore(
    <ErrorDetails
      failedSystemIds={failedSystemIds}
      failureDetails={failureDetails}
    />
  );

  expect(screen.getByText(/failed for 2 machines/)).toBeInTheDocument();
});

it("displays error message with machine systemIds", () => {
  renderWithMockStore(
    <ErrorDetails
      failedSystemIds={failedSystemIds}
      failureDetails={failureDetails}
    />
  );

  expect(screen.getByRole("term")).toHaveTextContent(errorMessage);
  screen.getAllByRole("definition").forEach((definition, i) => {
    expect(definition).toHaveTextContent(failedSystemIds[i]);
  });
});
