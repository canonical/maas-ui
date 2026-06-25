import type { ReactElement } from "react";
import { useEffect, useMemo, useState } from "react";

import { MultiSelect, type MultiSelectItem } from "@canonical/react-components";
import { useField, useFormikContext } from "formik";

import { useGroups } from "@/app/api/query/groups";
import FormikField from "@/app/base/components/FormikField";
import { FormikFieldChangeError } from "@/app/base/components/FormikField/FormikField";

type Props = {
  help?: string;
  label?: string;
  name: string;
  placeholder?: string;
};

export enum Labels {
  DefaultLabel = "Groups",
}

export const GroupMultiSelect = ({
  help,
  label = Labels.DefaultLabel,
  name,
  placeholder = "Select groups",
}: Props): ReactElement => {
  const id = `${name}-groups-multiselect`;
  const { setFieldValue } = useFormikContext();
  const [field] = useField<(number | string)[]>(name);

  const { data: groups } = useGroups();

  const [isOpen, setIsOpen] = useState(false);
  const [renderKey, setRenderKey] = useState(0);

  const groupItems = useMemo(
    (): MultiSelectItem[] =>
      groups?.items.map((group) => ({
        value: group.id,
        label: group.name,
      })) ?? [],
    [groups]
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target;
      const fieldElement = document.querySelector(
        `[data-multiselect-key="${id}"]`
      );
      if (!fieldElement) return;
      if (
        target instanceof Element &&
        (fieldElement.contains(target) ||
          target.closest(".multi-select__dropdown"))
      ) {
        return;
      }
      // Click is outside - force re-render to close.
      setRenderKey((prev) => prev + 1);
      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [id, isOpen]);

  return (
    <div className="p-form__group">
      <label className="p-form__label" htmlFor={id}>
        {label}
      </label>
      <div
        data-multiselect-key={id}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <FormikField
          component={MultiSelect}
          id={id}
          items={groupItems}
          key={`${id}-${renderKey}`}
          label={label}
          name={name}
          onItemsUpdate={(items: MultiSelectItem[]) => {
            setFieldValue(
              name,
              items.map((item) => item.value)
            ).catch((reason: unknown) => {
              throw new FormikFieldChangeError(
                name,
                "setFieldValue",
                reason as string
              );
            });
          }}
          placeholder={placeholder}
          selectedItems={groupItems.filter((item) =>
            field.value?.includes(item.value)
          )}
          variant="condensed"
        />
      </div>
      {help ? (
        <p className="p-form-help-text" style={{ marginTop: "0.5rem" }}>
          {help}
        </p>
      ) : null}
    </div>
  );
};

export default GroupMultiSelect;
