import { useState } from "react";

import { MultiSelect, type MultiSelectItem } from "@canonical/react-components";
import { Field } from "formik";

import type { GroupedImages } from "@/app/images/components/ImagesForms/SelectUpstreamImagesForm/SelectUpstreamImagesForm";
import "./_index.scss";

const getValueKey = (distro: string, release: string) =>
  `${distro}-${release}`.replace(".", "-");

type DownloadImagesSelectProps = {
  values: Record<string, MultiSelectItem[]>;
  setFieldValue: (key: string, value: MultiSelectItem) => void;
  groupedImages: GroupedImages;
};

const SelectUpstreamImagesSelect = ({
  values,
  setFieldValue,
  groupedImages,
}: DownloadImagesSelectProps) => {
  const [expandedDistro, setExpandedDistro] = useState<Array<string>>([]);

  return (
    <>
      {Object.keys(groupedImages).map((distro) => {
        const isExpanded = expandedDistro.indexOf(distro) !== -1;

        return (
          <div className="p-accordion" key={distro}>
            <button
              aria-expanded={isExpanded}
              className="p-accordion__tab"
              onClick={() =>
                setExpandedDistro((prevState) => {
                  if (isExpanded) {
                    return prevState.filter((value) => value !== distro);
                  }
                  return [...prevState, distro];
                })
              }
              role="tab"
              type="button"
            >
              <h2 className="p-heading--4">{distro}</h2>
            </button>
            {isExpanded && (
              <section
                aria-hidden={!isExpanded}
                className="p-accordion__panel"
                role="tabpanel"
              >
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
              </section>
            )}
          </div>
        );
      })}
    </>
  );
};

export default SelectUpstreamImagesSelect;
