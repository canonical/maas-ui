import { formatPowerParameters } from "./formatPowerParameters";

describe("formatPowerParameters", () => {
  it("trims power parameters object to those relevant to power type", () => {
    const powerType = {
      fields: [{ name: "field1" }, { name: "field2" }],
    };
    const powerParameters = {
      field1: "value1",
      field2: "value2",
      field3: "value3",
    };
    expect(formatPowerParameters(powerType, powerParameters)).toStrictEqual({
      field1: "value1",
      field2: "value2",
    });
  });

  it("can rename parameters for when adding a chassis", () => {
    const powerType = {
      fields: [
        { name: "power_address" },
        { name: "power_pass" },
        { name: "power_port" },
        { name: "power_protocol" },
        { name: "power_token_name" },
        { name: "power_token_secret" },
        { name: "power_user" },
        { name: "power_verify_ssl" },
      ],
    };

    const powerParameters = {
      power_address: "value1",
      power_pass: "value2",
      power_port: "value3",
      power_protocol: "value4",
      power_token_name: "value5",
      power_token_secret: "value6",
      power_user: "value7",
      power_verify_ssl: "value8",
    };
    expect(
      formatPowerParameters(powerType, powerParameters, "chassis")
    ).toStrictEqual({
      hostname: "value1",
      password: "value2",
      port: "value3",
      protocol: "value4",
      token_name: "value5",
      token_secret: "value6",
      username: "value7",
      verify_ssl: "value8",
    });
  });

  it("does not include node scoped power parameters if driver type is not 'node'", () => {
    const powerType = {
      fields: [
        { name: "param1", scope: "bmc" },
        { name: "param2", scope: "bmc" },
        { name: "param3", scope: "node" },
      ],
    };

    const powerParameters = {
      param1: "value1",
      param2: "value2",
      param3: "value3",
    };
    expect(
      formatPowerParameters(powerType, powerParameters, "pod")
    ).toStrictEqual({
      param1: "value1",
      param2: "value2",
    });
  });
});
