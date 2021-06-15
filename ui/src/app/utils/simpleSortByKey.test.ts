import { simpleSortByKey } from "./simpleSortByKey";

describe("simpleSortByKey", () => {
  const arr = [
    { name: "Bob", age: 30 },
    { name: "Chris", age: 20 },
    { name: "Alice", age: 25 },
  ];

  it("correctly sorts objects by key", () => {
    expect(arr.sort(simpleSortByKey("name"))).toEqual([
      { name: "Alice", age: 25 },
      { name: "Bob", age: 30 },
      { name: "Chris", age: 20 },
    ]);
    expect(arr.sort(simpleSortByKey("age"))).toEqual([
      { name: "Chris", age: 20 },
      { name: "Alice", age: 25 },
      { name: "Bob", age: 30 },
    ]);
  });

  it("can reverse sort", () => {
    expect(arr.sort(simpleSortByKey("name", { reverse: true }))).toEqual([
      { name: "Chris", age: 20 },
      { name: "Bob", age: 30 },
      { name: "Alice", age: 25 },
    ]);
    expect(arr.sort(simpleSortByKey("age", { reverse: true }))).toEqual([
      { name: "Bob", age: 30 },
      { name: "Alice", age: 25 },
      { name: "Chris", age: 20 },
    ]);
  });
});
