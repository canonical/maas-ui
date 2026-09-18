import { GenericTable } from "@canonical/maas-react-components";

import { useImageSources } from "@/app/api/query/imageSources";
import { useAvailableSelections } from "@/app/api/query/images";
import type { SelectedImage } from "@/app/images/components/SelectUpstreamImages/SelectUpstreamImages";
import useSelectedImagesTableColumns from "@/app/images/components/SelectUpstreamImages/components/SelectUpstreamImageSourcesForm/SelectedImagesTable/useSelectedImagesTableColumns/useSelectedImagesTableColumns";

import "./_index.scss";

type SelectedImagesTableProps = {
  selectedImages: SelectedImage[];
  setSelectedImages: (images: SelectedImage[]) => void;
};

const SelectedImagesTable = ({
  selectedImages,
  setSelectedImages,
}: SelectedImagesTableProps) => {
  const { data: sources, isPending: isSourcesPending } = useImageSources();
  const { data: availableImages } = useAvailableSelections();

  const columns = useSelectedImagesTableColumns({
    selectedImages,
    setSelectedImages,
    sources: sources?.items,
    availableImages: availableImages?.items,
    isSourcesPending,
  });

  return (
    <GenericTable
      aria-label="Selected images table"
      className="selected-images-table"
      columns={columns}
      data={selectedImages}
      isLoading={false}
      noData="No upstream images were selected."
      sorting={[
        { id: "title", desc: true },
        { id: "architecture", desc: false },
      ]}
      variant="regular"
    />
  );
};

export default SelectedImagesTable;
