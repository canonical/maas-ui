import { generateCheckboxHandlers } from "./generateCheckboxHandlers";

describe("generateCheckboxHandlers", () => {
  const onChange = jest.fn();
  const { handleGroupCheckbox, handleRowCheckbox } = generateCheckboxHandlers<
    number
  >((newIDs) => onChange(newIDs));

  describe("handleGroupCheckbox", () => {
    it("correctly runs onChange with all ids in a group if none already selected", () => {
      handleGroupCheckbox([3, 4], [1, 2]);
      expect(onChange).toHaveBeenCalledWith([1, 2, 3, 4]);
    });

    it("correctly runs onChange to remove all ids in a group if at least one already selected", () => {
      handleGroupCheckbox([1, 2, 3], [3, 4]);
      expect(onChange).toHaveBeenCalledWith([4]);
    });
  });

  describe("handleRowCheckbox", () => {
    it("correctly runs onChange to add id if not already selected", () => {
      handleRowCheckbox(3, [1, 2]);
      expect(onChange).toHaveBeenCalledWith([1, 2, 3]);
    });

    it("correctly runs onChange to remove id if already selected", () => {
      handleRowCheckbox(1, [1, 2]);
      expect(onChange).toHaveBeenCalledWith([2]);
    });
  });
});
