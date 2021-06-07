import { useState } from "react";

import { Button, Col, Form, Input, Row } from "@canonical/react-components";
import { useDispatch } from "react-redux";

import { actions as domainActions } from "app/store/domain";

type Props = {
  closeForm: () => void;
};

const DomainListHeaderForm = ({ closeForm }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [isAuthoritative, setAuthoritative] = useState(true);

  // Pattern that matches a domainname.
  // XXX 2016-02-24 lamont: This also matches "example.com.",
  // which is wrong.
  const domainnamePattern = /^([a-z\d]|[a-z\d][a-z\d-.]*[a-z\d])*$/i;

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.currentTarget.value;
    setName(newName);
    if (newName.length === 0) {
      setNameError("The domain name cannot be empty");
    } else if (newName.length >= 253) {
      setNameError("The domain name is too long");
    } else if (!domainnamePattern.test(newName)) {
      setNameError("The domain name is incorrect");
    } else {
      setNameError(null);
    }
  };
  const onAuthoritativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthoritative(e.currentTarget.checked);
  };

  const onSaveClick = () => {
    console.log({ name: name, isAuthoritative: isAuthoritative });
    dispatch(
      domainActions.create({ authoritative: isAuthoritative, name: name })
    );
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
            error={nameError}
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
          disabled={!name || !!nameError}
        >
          Save and add another
        </Button>
        <Button
          appearance="positive"
          onClick={onSaveAndCloseClick}
          disabled={!name || !!nameError}
        >
          Save domain
        </Button>
      </Col>
    </Row>
  );
};

export default DomainListHeaderForm;
