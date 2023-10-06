import { generateEmptyStateMsg } from "./generateEmptyStateMsg";

describe("generateEmptyStateMsg", () => {
  it("returns an empty filter text if filter is enabled", () => {
    const emptystateMessages = {
      noResult: "No data matches your search criteria.",
      emptyList: "No data available.",
    };
    const response = generateEmptyStateMsg({
      hasFilter: true,
      emptyStateMsg: emptystateMessages.emptyList,
      emptySearchMsg: emptystateMessages.noResult,
    });

    expect(response).toEqual(emptystateMessages.noResult);
  });

  it("returns an empty filter text if filter is disabled", () => {
    const emptystateMessages = {
      noResult: "No data matches your search criteria.",
      emptyList: "No data available.",
    };
    const response = generateEmptyStateMsg({
      hasFilter: false,
      emptyStateMsg: emptystateMessages.emptyList,
      emptySearchMsg: emptystateMessages.noResult,
    });

    expect(response).toEqual(emptystateMessages.emptyList);
  });
});
