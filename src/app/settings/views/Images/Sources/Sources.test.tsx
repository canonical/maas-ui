import Sources from "@/app/settings/views/Images/Sources/Sources";
import AddSource from "@/app/settings/views/Images/Sources/components/AddSource";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import { ConfigNames } from "@/app/store/config/types";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import { configurationsResolvers } from "@/testing/resolvers/configurations";
import { imageSourceResolvers } from "@/testing/resolvers/imageSources";
import { imageResolvers } from "@/testing/resolvers/images";
import {
  mockSidePanel,
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  imageSourceResolvers.listImageSources.handler(),
  imageSourceResolvers.getImageSource.handler(),
  imageSourceResolvers.fetchImageSource.handler(),
  imageSourceResolvers.createImageSource.handler(),
  imageSourceResolvers.updateImageSource.handler(),
  imageSourceResolvers.deleteImageSource.handler(),
  imageResolvers.listSelectionStatuses.handler(),
  imageResolvers.listCustomImageStatuses.handler(),
  configurationsResolvers.getConfiguration.handler({
    name: ConfigNames.BOOT_IMAGES_AUTO_IMPORT,
    value: true,
  }),
  configurationsResolvers.setConfiguration.handler(),
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler()
);
const { mockOpen } = await mockSidePanel();

describe("Sources", () => {
  it("opens add source side panel form", async () => {
    renderWithProviders(<Sources />);

    await userEvent.click(
      screen.getByRole("button", { name: "Add custom source" })
    );

    expect(mockOpen).toHaveBeenCalledWith({
      component: AddSource,
      title: "Add custom source",
    });
  });

  it("disables the 'Add custom source' button without edit permissions", async () => {
    mockServer.use(
      authResolvers.getMeEntitlements.handler([
        factory.entitlement({
          entitlement: Entitlement.CAN_VIEW_BOOT_ENTITIES,
        }),
      ])
    );

    renderWithProviders(<Sources />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Add custom source" })
      ).toBeAriaDisabled();
    });
  });
});
