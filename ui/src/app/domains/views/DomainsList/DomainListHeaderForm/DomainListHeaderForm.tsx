import { useState } from "react";

import { Button, Col, Form, Input, Row } from "@canonical/react-components";

type Props = {
  closeForm: () => void;
};

const DomainListHeaderForm = ({ closeForm }: Props): JSX.Element => {
  const [name, setName] = useState("");
  const [isAuthoritative, setAuthoritative] = useState(true);

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };
  const onAuthoritativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthoritative(e.currentTarget.checked);
  };

  const onSaveClick = () => {
    console.log({ name: name, isAuthoritative: isAuthoritative });
  };

  const onSaveAndCloseClick = () => {
    onSaveClick();
    closeForm();
  };

  return (
    <Row>
      <Col size="6">
        <Form inline={true} className="row">
          <Input
            id="name"
            type="text"
            wrapperClassName="col-3"
            onChange={onNameChange}
            label="Name"
            placeholder="Domain name"
          />
          <Input
            id="Authoritative"
            wrapperClassName="col-3"
            type="checkbox"
            defaultChecked
            onChange={onAuthoritativeChange}
            label="Authoritative"
          />
        </Form>
      </Col>
      <Col size="6" className="u-align--right">
        <Button appearance="base" onClick={closeForm}>
          Cancel
        </Button>
        <Button
          appearance="neutral"
          onClick={onSaveClick}
          disabled={name === ""}
        >
          Save and add another
        </Button>
        <Button
          appearance="positive"
          onClick={onSaveAndCloseClick}
          disabled={name === ""}
        >
          Save domain
        </Button>
      </Col>
    </Row>
  );
};

export default DomainListHeaderForm;
