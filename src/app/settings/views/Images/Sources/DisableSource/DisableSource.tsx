import type { ReactElement } from "react";

import {
  Notification as NotificationBanner,
  Spinner,
} from "@canonical/react-components";

import {
  useDisableImageSource,
  useGetImageSource,
} from "@/app/api/query/imageSources";
import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useSidePanel } from "@/app/base/side-panel-context";

type DisableSourceProps = {
  id: number;
};

const DisableSource = ({ id }: DisableSourceProps): ReactElement => {
  const { closeSidePanel } = useSidePanel();

  const source = useGetImageSource({ path: { boot_source_id: id } }, true);

  const eTag = source.data?.headers?.get("ETag");
  const disableSource = useDisableImageSource();

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
          aria-label="Confirm custom source disabling"
          errors={disableSource.error}
          initialValues={{}}
          message={
            // TODO: add actual source name
            <>
              Are you sure you want to disable <strong>Source</strong> (
              {source.data.url})?
            </>
          }
          modelType="default source"
          onCancel={closeSidePanel}
          onSubmit={() => {
            disableSource.mutate({
              headers: { ETag: eTag },
              path: { boot_source_id: id },
            });
          }}
          onSuccess={closeSidePanel}
          saved={disableSource.isSuccess}
          saving={disableSource.isPending}
          submitLabel="Disable source"
        />
      )}
    </>
  );
};

export default DisableSource;
