import {
  MAAS_IO_DEFAULT_KEYRING_FILE_PATHS,
  MAAS_IO_URLS,
} from "@/app/images/constants";
import type { ChangeSourceValues } from "@/app/settings/views/Images/ChangeSource/ChangeSource";
import MaasIoSourceForm from "@/app/settings/views/Images/ChangeSource/MaasIoSourceForm/MaasIoSourceForm";
import { renderWithProviders, screen } from "@/testing/utils";

describe("MaasIoSourceForm", () => {
  it("pre-populates MAAS.io stream selector with correct channel from URL", async () => {
    const candidateStreamValues: ChangeSourceValues = {
      keyring_data: "",
      keyring_filename: MAAS_IO_DEFAULT_KEYRING_FILE_PATHS.deb,
      keyring_type: "keyring_filename",
      url: MAAS_IO_URLS.candidate,
      priority: 0,
      autoSync: false,
    };

    const { rerender } = renderWithProviders(
      <MaasIoSourceForm
        enabled={true}
        errors={null}
        initialValues={candidateStreamValues}
        onSubmit={vi.fn()}
        onValuesChanged={vi.fn()}
        saved={false}
        saving={false}
        serverValues={candidateStreamValues}
      />
    );

    // Verify the stream selector is set to candidate
    const streamSelect = screen.getByRole("combobox", { name: "Stream" });
    expect(streamSelect).toHaveValue("candidate");

    const stableStreamValues: ChangeSourceValues = {
      keyring_data: "",
      keyring_filename: MAAS_IO_DEFAULT_KEYRING_FILE_PATHS.deb,
      keyring_type: "keyring_filename",
      url: MAAS_IO_URLS.stable,
      priority: 0,
      autoSync: false,
    };

    // Switch to stable URL and verify the selector updates
    rerender(
      <MaasIoSourceForm
        enabled={true}
        errors={null}
        initialValues={stableStreamValues}
        onSubmit={vi.fn()}
        onValuesChanged={vi.fn()}
        saved={false}
        saving={false}
        serverValues={stableStreamValues}
      />
    );

    const stableStreamSelect = screen.getByRole("combobox", {
      name: "Stream",
    });
    expect(stableStreamSelect).toHaveValue("stable");
  });
});
