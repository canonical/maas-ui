import { useSidePanel } from "@canonical/maas-react-components";
import { Strip } from "@canonical/react-components";

import { useAddSelections } from "@/app/api/query/images";
import FormikForm from "@/app/base/components/FormikForm";
import SelectedImagesTable from "@/app/images/components/SelectUpstreamImageSourcesForm/SelectedImagesTable";
import type {
  SelectedImage,
  SelectUpstreamImagesStepValues,
} from "@/app/images/components/SelectUpstreamImages/SelectUpstreamImages";
import { SelectUpstreamImagesSteps } from "@/app/images/components/SelectUpstreamImages/SelectUpstreamImages";

type SelectUpstreamImageSourcesFormProps = {
  selectedImages: SelectedImage[];
  setSelectedImages: (images: SelectedImage[]) => void;
  setStep: (step: SelectUpstreamImagesStepValues) => void;
};

const SelectUpstreamImageSourcesForm = ({
  selectedImages,
  setSelectedImages,
  setStep,
}: SelectUpstreamImageSourcesFormProps) => {
  const { closeSidePanel } = useSidePanel();

  const addSelections = useAddSelections();

  return (
    <>
      Select the sources from which the new selections should be synced. The
      default sources are populated according to source priority.
      <Strip shallow>
        <FormikForm
          aria-label="Select upstream images sources"
          buttonsBehavior="independent"
          enableReinitialize
          errors={addSelections.error}
          initialValues={{}}
          onCancel={closeSidePanel}
          onSubmit={() => {
            addSelections.mutate({
              body: selectedImages.map((img) => ({
                arch: img.architecture,
                boot_source_id: img.source_id,
                os: img.os,
                release: img.release,
              })),
            });
            closeSidePanel();
          }}
          secondarySubmit={() => {
            setStep(SelectUpstreamImagesSteps.IMAGE_SELECTION);
          }}
          secondarySubmitLabel="Back"
          submitLabel="Save and sync"
        >
          {() => (
            <SelectedImagesTable
              selectedImages={selectedImages}
              setSelectedImages={setSelectedImages}
            />
          )}
        </FormikForm>
      </Strip>
    </>
  );
};

export default SelectUpstreamImageSourcesForm;
