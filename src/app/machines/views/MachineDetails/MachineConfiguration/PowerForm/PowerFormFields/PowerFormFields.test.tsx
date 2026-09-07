import { Formik } from "formik";

import PowerFormFields from ".";

import { PowerFieldScope } from "@/app/store/general/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { powerTypesResolvers } from "@/testing/resolvers/powerTypes";
import { systemResolvers } from "@/testing/resolvers/system";
import {
  screen,
  renderWithMockStore,
  setupMockServer,
  waitForLoading,
} from "@/testing/utils";

setupMockServer(
  powerTypesResolvers.listPowerTypes.handler(),
  systemResolvers.getSystemInfo.handler()
);

describe("PowerFormFields", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      general: factory.generalState({
        powerTypes: factory.powerTypesState({
          data: [factory.powerType({ fields: [], name: "manual" })],
          loaded: true,
        }),
      }),
    });
  });

  it("disables the power select and limits field scopes to node if machine is in a pod", async () => {
    state.general.powerTypes.data = [
      factory.powerType({
        fields: [
          factory.powerField({
            label: "Node field",
            name: "node-field",
            scope: PowerFieldScope.NODE,
          }),
          factory.powerField({
            label: "BMC field",
            name: "bmc-field",
            scope: PowerFieldScope.BMC,
          }),
        ],
        name: "manual",
      }),
    ];
    const machine = factory.machineDetails({
      pod: {
        id: 1,
        name: "pod",
      },
      power_bmc_node_count: 1,
      power_type: "manual",
      system_id: "abc123",
    });

    renderWithMockStore(
      <Formik
        initialValues={{
          powerParameters: {},
          powerType: "manual",
        }}
        onSubmit={vi.fn()}
      >
        <PowerFormFields machine={machine} />
      </Formik>,
      { state }
    );

    await waitForLoading();

    expect(screen.getByRole("button", { name: /Power type/ })).toHaveAttribute(
      "aria-disabled",
      "true"
    );
    expect(
      screen.getByRole("textbox", { name: "Node field" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", { name: "BMC field" })
    ).not.toBeInTheDocument();
  });
});
