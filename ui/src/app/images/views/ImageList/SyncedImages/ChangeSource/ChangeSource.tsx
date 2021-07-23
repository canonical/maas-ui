import { useState } from "react";

import { Card } from "@canonical/react-components";

import FetchImagesForm from "./FetchImagesForm";
import FetchedImages from "./FetchedImages";

import type { BootResourceUbuntuSource } from "app/store/bootresource/types";

type Props = {
  closeForm: (() => void) | null;
  inCard?: boolean;
};

const ChangeSource = ({ closeForm, inCard = true }: Props): JSX.Element => {
  const [source, setSource] = useState<BootResourceUbuntuSource | null>(null);

  const content = source ? (
    <FetchedImages
      closeForm={closeForm ? () => closeForm() : () => setSource(null)}
      source={source}
    />
  ) : (
    <FetchImagesForm closeForm={closeForm} setSource={setSource} />
  );
  if (inCard) {
    return <Card highlighted>{content}</Card>;
  }
  return content;
};

export default ChangeSource;
