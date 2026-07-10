import { GenericTable } from "@canonical/maas-react-components";

import { useImageSources } from "@/app/api/query/imageSources";
import { useAvailableSelections } from "@/app/api/query/images";
import useSelectedImagesTableColumns from "@/app/images/components/SelectUpstreamImageSourcesForm/SelectedImagesTable/useSelectedImagesTableColumns/useSelectedImagesTableColumns";
import type { SelectedImage } from "@/app/images/components/SelectUpstreamImages/SelectUpstreamImages";

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
      sorting={[{ id: "title", desc: true }]}
      variant="regular"
    />
  );
};

export default SelectedImagesTable;
