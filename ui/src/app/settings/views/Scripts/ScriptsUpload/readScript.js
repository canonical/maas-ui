import { notificationTypes } from "@canonical/react-components";
import pathParse from "path-parse";

import { actions as messageActions } from "app/store/message";

export const hasMetadata = (binaryStr) => {
  let hasMeta = false;
  try {
    const scriptArray = binaryStr.split("\n");
    scriptArray.forEach((line) => {
      if (line.includes("--- Start MAAS 1.0 script metadata ---")) {
        hasMeta = true;
      }
    });
  } catch {
    console.error("Unable to parse script for metadata.");
    hasMeta = false;
  }
  return hasMeta;
};

const readScript = (file, dispatch, callback) => {
  const scriptName = pathParse(file.path).name;

  const reader = new FileReader();

  reader.onabort = () => {
    dispatch(
      messageActions.add("Reading file aborted.", notificationTypes.NEGATIVE)
    );
  };
  reader.onerror = () => {
    dispatch(
      messageActions.add("Error reading file.", notificationTypes.NEGATIVE)
    );
  };

  reader.onload = () => {
    const binaryStr = reader.result;
    const meta = hasMetadata(binaryStr);

    callback({
      name: scriptName,
      script: binaryStr,
      hasMetadata: meta,
    });
  };

  reader.readAsBinaryString(file);
};

export default readScript;
