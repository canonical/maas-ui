import { useMemo } from "react";

import {
  Accordion,
  MultiSelect,
  type MultiSelectItem,
} from "@canonical/react-components";
import type { Section } from "@canonical/react-components/dist/components/Accordion/Accordion";
import { Field } from "formik";

import type { GroupedImages } from "@/app/images/components/ImagesForms/SelectUpstreamImagesForm/SelectUpstreamImagesForm";

import "./_index.scss";

export const getValueKey = (distro: string, release: string) =>
  `${distro}-${release}`.replace(".", "-");

export type DownloadImagesSelectProps = {
  values: Record<string, MultiSelectItem[]>;
  setFieldValue: (key: string, value: MultiSelectItem) => void;
  groupedImages: GroupedImages;
};

const SelectUpstreamImagesSelect = ({
  values,
  setFieldValue,
  groupedImages,
}: DownloadImagesSelectProps) => {
  const accordionSections = useMemo(
    () =>
      Object.keys(groupedImages).map((distro) => {
        return {
          key: distro,
          content: (
            <table className="download-images-table">
              <thead>
                <tr>
                  <th>Release Title</th>
                  <th>Architecture</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(groupedImages[distro]).map((release) => (
                  <tr key={release}>
                    <td>{release}</td>
                    <td>
                      <Field
                        as={MultiSelect}
                        items={groupedImages[distro][release]}
                        name={getValueKey(distro, release)}
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
          ),
          titleElement: "h4",
          title: distro,
        } as Section;
      }),
    [groupedImages, values, setFieldValue]
  );
  return <Accordion sections={accordionSections} />;
};
export default SelectUpstreamImagesSelect;
