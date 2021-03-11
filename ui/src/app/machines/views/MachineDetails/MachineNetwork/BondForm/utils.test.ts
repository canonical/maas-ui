import { getFirstSelected } from "./utils";

import {
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
} from "testing/factories";

describe("BondForm utils", () => {
  it("sorts the nics by name and gets the first interface", () => {
    const interfaces = [
      machineInterfaceFactory({
        name: "bbb",
      }),
      machineInterfaceFactory({
        name: "ccc",
      }),
      machineInterfaceFactory({
        name: "aaa",
      }),
    ];
    const machine = machineDetailsFactory({
      interfaces,
    });
    expect(
      getFirstSelected(machine, [
        { nicId: interfaces[0].id },
        { nicId: interfaces[1].id },
        { nicId: interfaces[2].id },
      ])
    ).toStrictEqual({ nicId: interfaces[2].id });
  });
});
