import { Link } from "react-router-dom";

import DoubleRow from "app/base/components/DoubleRow";

type Props = {
  name: string;
  secondary?: string;
  url: string;
};

const NameColumn = ({ name, secondary, url }: Props): JSX.Element | null => {
  return (
    <DoubleRow
      primary={
        <Link to={url}>
          <strong data-test="name">{name}</strong>
        </Link>
      }
      secondary={<span data-test="secondary">{secondary}</span>}
    />
  );
};

export default NameColumn;
