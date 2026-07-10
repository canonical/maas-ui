import type { ReactElement } from "react";
import { useState } from "react";

import { Stepper } from "@canonical/maas-react-components";

import type { UiSourceAvailableImageResponse } from "@/app/apiclient";
import SelectUpstreamImageSourcesForm from "@/app/images/components/SelectUpstreamImageSourcesForm";
import SelectUpstreamImagesForm from "@/app/images/components/SelectUpstreamImagesForm";

export type SelectedImage = UiSourceAvailableImageResponse & { id: string };

export type SelectUpstreamImagesStepValues =
  | "Image selection"
  | "Source configuration";

export const SelectUpstreamImagesSteps = {
  IMAGE_SELECTION: "Image selection",
  SOURCE_CONFIGURATION: "Source configuration",
} as const;

const SelectUpstreamImages = (): ReactElement => {
  const [step, setStep] = useState<SelectUpstreamImagesStepValues>(
    SelectUpstreamImagesSteps.IMAGE_SELECTION
  );
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const stepIndex = Object.values(SelectUpstreamImagesSteps).indexOf(step);

  return (
    <>
      <Stepper
        activeStep={stepIndex}
        items={Object.values(SelectUpstreamImagesSteps)}
      />
      <hr />
      {step === SelectUpstreamImagesSteps.IMAGE_SELECTION && (
        <SelectUpstreamImagesForm
          setSelectedImages={setSelectedImages}
          setStep={setStep}
        />
      )}
      {step === SelectUpstreamImagesSteps.SOURCE_CONFIGURATION && (
        <SelectUpstreamImageSourcesForm
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImages}
          setStep={setStep}
        />
      )}
    </>
  );
};

export default SelectUpstreamImages;
