import { useState } from "react";

import { Card } from "@canonical/react-components";

import FetchImagesForm from "./FetchImagesForm";
import FetchedImages from "./FetchedImages";

import type { BootResourceUbuntuSource } from "app/store/bootresource/types";

type Props = {
  closeForm: (() => void) | null;
};

const ChangeSource = ({ closeForm }: Props): JSX.Element => {
  const [source, setSource] = useState<BootResourceUbuntuSource | null>(null);

  return (
    <Card highlighted>
      {source ? (
        <FetchedImages
          closeForm={closeForm ? () => closeForm() : () => setSource(null)}
          source={source}
        />
      ) : (
        <FetchImagesForm closeForm={closeForm} setSource={setSource} />
      )}
    </Card>
  );
};

export default ChangeSource;
