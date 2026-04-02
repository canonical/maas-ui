import type { ReactElement } from "react";

import {
  Notification as NotificationBanner,
  Spinner,
} from "@canonical/react-components";

import {
  useEnableImageSource,
  useGetImageSource,
} from "@/app/api/query/imageSources";
import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useSidePanel } from "@/app/base/side-panel-context";

type EnableSourceProps = {
  id: number;
};

const EnableSource = ({ id }: EnableSourceProps): ReactElement => {
  const { closeSidePanel } = useSidePanel();

  const source = useGetImageSource({ path: { boot_source_id: id } }, true);

  const eTag = source.data?.headers?.get("ETag");
  const enableSource = useEnableImageSource();

  return (
    <>
      {source.isPending && <Spinner text="Loading..." />}
      {source.isError && (
        <NotificationBanner severity="negative">
          {source.error.message}
        </NotificationBanner>
      )}
      {source.isSuccess && source.data && (
        <ModelActionForm
          aria-label="Confirm custom source enabling"
          errors={enableSource.error}
          initialValues={{}}
          message={
            // TODO: add actual source name
            <>
              <strong>Source</strong> will now be used to download images.
            </>
          }
          modelType="default source"
          onCancel={closeSidePanel}
          onSubmit={() => {
            enableSource.mutate({
              headers: { ETag: eTag },
              path: { boot_source_id: id },
            });
          }}
          onSuccess={closeSidePanel}
          saved={enableSource.isSuccess}
          saving={enableSource.isPending}
          submitAppearance="positive"
          submitLabel="Enable source"
        />
      )}
    </>
  );
};

export default EnableSource;
