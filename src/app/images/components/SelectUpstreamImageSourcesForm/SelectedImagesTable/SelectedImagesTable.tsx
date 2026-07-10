import { GenericTable } from "@canonical/maas-react-components";

import useSelectedImagesTableColumns from "@/app/images/components/SelectUpstreamImageSourcesForm/SelectedImagesTable/useSelectedImagesTableColumns/useSelectedImagesTableColumns";
import type { SelectedImage } from "@/app/images/components/SelectUpstreamImages/SelectUpstreamImages";

type SelectedImagesTableProps = {
  selectedImages: SelectedImage[];
  setSelectedImages: (images: SelectedImage[]) => void;
};

const SelectedImagesTable = ({
  selectedImages,
  setSelectedImages,
}: SelectedImagesTableProps) => {
  const columns = useSelectedImagesTableColumns({
    selectedImages,
    setSelectedImages,
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
