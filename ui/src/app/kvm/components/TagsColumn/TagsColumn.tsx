import DoubleRow from "app/base/components/DoubleRow";

type Props = { tags: string[] };

const TagsColumn = ({ tags }: Props): JSX.Element | null => {
  return (
    <DoubleRow primary={<span data-test="pod-tags">{tags.join(", ")}</span>} />
  );
};

export default TagsColumn;
