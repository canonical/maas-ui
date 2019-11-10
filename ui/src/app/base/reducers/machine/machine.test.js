import machine from "./machine";

describe("machine reducer", () => {
  it("should return the initial state", () => {
    expect(machine(undefined, {})).toEqual({
      items: [],
      loaded: false,
      loading: false
    });
  });

  it("should correctly reduce FETCH_MACHINE_START", () => {
    expect(
      machine(undefined, {
        type: "FETCH_MACHINE_START"
      })
    ).toEqual({
      items: [],
      loaded: false,
      loading: true
    });
  });

  it("should correctly reduce FETCH_MACHINE_SUCCESS", () => {
    expect(
      machine(
        {
          items: [],
          loaded: false,
          loading: true
        },
        {
          type: "FETCH_MACHINE_SUCCESS",
          payload: [
            { id: 1, hostname: "node1" },
            { id: 2, hostname: "node2" }
          ]
        }
      )
    ).toEqual({
      loading: false,
      loaded: true,
      items: [
        { id: 1, hostname: "node1" },
        { id: 2, hostname: "node2" }
      ]
    });
  });
});
