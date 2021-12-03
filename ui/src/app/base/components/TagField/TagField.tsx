import { useFormikContext } from "formik";

import FormikField from "app/base/components/FormikField";
import type { Props as FormikFieldProps } from "app/base/components/FormikField/FormikField";
import TagSelector from "app/base/components/TagSelector";
import type {
  Props as TagSelectorProps,
  Tag,
} from "app/base/components/TagSelector/TagSelector";
import type { AnyObject } from "app/base/types";

type Props = {
  tagList?: string[] | null;
  name?: string;
} & Omit<Partial<FormikFieldProps>, "name"> &
  Partial<TagSelectorProps>;

const TagField = <V extends AnyObject = AnyObject>({
  name = "tags",
  placeholder = "Select or create tags",
  tagList,
  ...props
}: Props): JSX.Element => {
  const { initialValues, setFieldValue } = useFormikContext<V>();
  let initial: string[] = [];
  if (name in initialValues && Array.isArray(initialValues[name])) {
    initial = initialValues[name] as string[];
  }
  return (
    <FormikField
      allowNewTags
      component={TagSelector}
      initialSelected={initial.map((tag: string) => ({
        name: tag,
      }))}
      label="Tags"
      name={name}
      onTagsUpdate={(tags: Tag[]) =>
        setFieldValue(
          name,
          tags.map(({ name }) => name)
        )
      }
      placeholder={placeholder}
      // Populate the list of tags with the provided list or with the initial values list.
      // The initial values array uses spread to make it writable by `sort()`.
      tags={(tagList || [...initial] || [])
        .sort()
        .map((tag: string) => ({ name: tag }))}
      {...props}
    />
  );
};

export default TagField;
