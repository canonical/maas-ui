import { useState } from "react";

import { useSelector } from "react-redux";

import FetchImagesForm from "./FetchImagesForm";
import FetchedImages from "./FetchedImages";

import bootResourceSelectors from "app/store/bootresource/selectors";
import type { BootResourceUbuntuSource } from "app/store/bootresource/types";

type Props = {
  onCancel: (() => void) | null;
};

const ChangeSource = ({ onCancel }: Props): JSX.Element => {
  const fetchedImages = useSelector(bootResourceSelectors.fetchedImages);
  const [source, setSource] = useState<BootResourceUbuntuSource | null>(null);

  if (source && fetchedImages) {
    return <FetchedImages onCancel={() => setSource(null)} source={source} />;
  }
  return <FetchImagesForm onCancel={onCancel} setSource={setSource} />;
};

export default ChangeSource;
