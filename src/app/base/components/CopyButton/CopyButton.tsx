import { useRef } from "react";

import { Button } from "@canonical/react-components";
import PropTypes from "prop-types";

type Props = {
  value: string;
};

const CopyButton = ({ value }: Props): JSX.Element => {
  const input = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    if (input.current !== null) {
      // To copy the value the input must be visible, so temporarily display the input as text.
      input.current.type = "text";
      input.current.focus();
      input.current.select();
      try {
        document.execCommand("copy");
      } catch (err) {
        console.error("Copy was unsuccessful");
      }
      // Copying is done so hide the input again.
      input.current.type = "hidden";
    }
  };
  return (
    <>
      <Button
        appearance="base"
        className="is-dense u-table-cell-padding-overlap u-no-margin--right"
        hasIcon
        onClick={handleClick}
      >
        <i className="p-icon--copy">Copy</i>
      </Button>
      <input type="hidden" ref={input} value={value} />
    </>
  );
};

CopyButton.propTypes = {
  value: PropTypes.string,
};

export default CopyButton;
