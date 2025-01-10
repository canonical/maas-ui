import React from "react";

import { MultiSelect, type MultiSelectItem } from "@canonical/react-components";
import { Field } from "formik";

import type { GroupedImages } from "@/app/images/components/SMImagesTable/DownloadImages/DownloadImages";

type DownloadImagesSelectProps = {
  values: Record<string, MultiSelectItem[]>;
  setFieldValue: (key: string, value: MultiSelectItem) => void;
  groupedImages: GroupedImages;
};

const getValueKey = (distro: string, release: string) =>
  `${distro}-${release}`.replace(".", "-");

const DownloadImagesSelect: React.FC<DownloadImagesSelectProps> = ({
  values,
  setFieldValue,
  groupedImages,
}) => {
  return (
    <>
      {Object.keys(groupedImages).map((distro) => (
        <span key={distro}>
          <h2 className="p-heading--4">{distro} images</h2>
          <table className="download-images-table">
            <thead>
              <tr>
                <th>Release</th>
                <th>Architecture</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(groupedImages[distro]).map((release) => (
                <tr aria-label={release} key={release}>
                  <td>{release}</td>
                  <td>
                    <Field
                      as={MultiSelect}
                      items={groupedImages[distro][release]}
                      name={`${distro}-${release}`}
                      onItemsUpdate={(items: MultiSelectItem) =>
                        setFieldValue(getValueKey(distro, release), items)
                      }
                      placeholder="Select architectures"
                      selectedItems={values[getValueKey(distro, release)]}
                      variant="condensed"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </span>
      ))}
    </>
  );
};

export default DownloadImagesSelect;
