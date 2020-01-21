import { simpleSortByKey } from "./simpleSortByKey";

describe("simpleSortByKey", () => {
  it("correctly sorts objects by key", () => {
    const arr = [
      { name: "Bob", age: 30 },
      { name: "Chris", age: 20 },
      { name: "Alice", age: 25 }
    ];

    expect(arr.sort(simpleSortByKey("name"))).toEqual([
      { name: "Alice", age: 25 },
      { name: "Bob", age: 30 },
      { name: "Chris", age: 20 }
    ]);
    expect(arr.sort(simpleSortByKey("age"))).toEqual([
      { name: "Chris", age: 20 },
      { name: "Alice", age: 25 },
      { name: "Bob", age: 30 }
    ]);
  });
});
