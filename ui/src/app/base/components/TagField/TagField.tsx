import { useFormikContext } from "formik";

import FormikField from "app/base/components/FormikField";
import type { Props as FormikFieldProps } from "app/base/components/FormikField/FormikField";
import TagSelector from "app/base/components/TagSelector";
import type {
  Props as TagSelectorProps,
  Tag,
} from "app/base/components/TagSelector/TagSelector";

type Props = {
  tagList?: string[] | null;
} & Partial<FormikFieldProps> &
  Partial<TagSelectorProps>;

const TagField = ({ name = "tags", tagList, ...props }: Props): JSX.Element => {
  const { initialValues, setFieldValue } = useFormikContext();
  const initial = initialValues[name] || [];
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
      placeholder="Select or create tags"
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
