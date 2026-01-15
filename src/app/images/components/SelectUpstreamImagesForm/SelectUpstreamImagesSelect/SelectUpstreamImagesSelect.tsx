import type { ReactElement } from "react";
import { useCallback, useState, useMemo } from "react";

import {
  Accordion,
  FormikField,
  MultiSelect,
  type MultiSelectItem,
} from "@canonical/react-components";
import type { Section } from "@canonical/react-components/dist/components/Accordion/Accordion";

import type { GroupedImages } from "@/app/images/components/SelectUpstreamImagesForm/SelectUpstreamImagesForm";

import "./_index.scss";

export const getValueKey = (
  distro: string,
  release: string,
  title: string
): string => `${distro}&${release}&${title}`.replace(".", "-");

export type DownloadImagesSelectProps = {
  values: Record<string, MultiSelectItem[]>;
  setFieldValue: (key: string, value: MultiSelectItem[]) => void;
  groupedImages: GroupedImages;
};

const SelectUpstreamImagesSelect = ({
  values,
  setFieldValue,
  groupedImages,
}: DownloadImagesSelectProps): ReactElement => {
  const [forceRenderKey, setForceRenderKey] = useState(0);

  const handleAccordionExpandedChange = useCallback(() => {
    // Force re-render of all MultiSelect components to close any open dropdowns
    setForceRenderKey((prev) => prev + 1);
  }, []);

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
                {Object.keys(groupedImages[distro]).map((key) => {
                  const [title, release] = key.split("&");
                  return (
                    <tr key={key}>
                      <td>
                        <div>{title}</div>
                        <small className="u-text--muted">{release}</small>
                      </td>
                      <td>
                        <FormikField
                          component={MultiSelect}
                          items={groupedImages[distro][key]}
                          key={`${getValueKey(distro, release, title)}-${forceRenderKey}`}
                          name={getValueKey(distro, release, title)}
                          onItemsUpdate={(items: MultiSelectItem[]) => {
                            setFieldValue(
                              getValueKey(distro, release, title),
                              items
                            );
                          }}
                          placeholder="Select architectures"
                          selectedItems={
                            values[getValueKey(distro, release, title)]
                          }
                          variant="condensed"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ),
          titleElement: "h4",
          title: distro,
        } as Section;
      }),
    [groupedImages, forceRenderKey, values, setFieldValue]
  );
  return (
    <Accordion
      onExpandedChange={handleAccordionExpandedChange}
      sections={accordionSections}
    />
  );
};
export default SelectUpstreamImagesSelect;
