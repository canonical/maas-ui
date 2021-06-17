import { useEffect } from "react";

import {
  ActionButton,
  Button,
  Col,
  Row,
  Icon,
} from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";

import type { RouteParams } from "app/base/types";
import domainsURLs from "app/domains/urls";
import { actions as domainActions } from "app/store/domain";
import domainSelectors from "app/store/domain/selectors";
import type { RootState } from "app/store/root/types";
type Props = {
  closeForm: () => void;
};

const DeleteDomainForm = ({ closeForm }: Props): JSX.Element => {
  const { id } = useParams<RouteParams>();
  const domain = useSelector((state: RootState) =>
    domainSelectors.getById(state, Number(id))
  );
  const history = useHistory();
  const saved = useSelector(domainSelectors.saved);
  const saving = useSelector(domainSelectors.saving);
  const dispatch = useDispatch();
  const recordsCount = domain?.resource_count ?? 0;

  useEffect(() => {
    if (saved) {
      dispatch(domainActions.cleanup());
      history.push({ pathname: domainsURLs.domains });
    }
  }, [dispatch, saved, history]);

  const deleteDomain = () => {
    dispatch(domainActions.delete(parseInt(id)));
  };

  let message = "Are you sure you want to delete this domain?";
  let deleteButton: JSX.Element | null = (
    <ActionButton
      data-test="delete-domain"
      appearance="negative"
      onClick={deleteDomain}
      loading={saving}
    >
      Delete domain
    </ActionButton>
  );

  if (recordsCount > 0) {
    message =
      "Domain cannot be deleted because it has resource records. Remove all resource records from the domain to allow deletion.";
    deleteButton = null;
  }

  return (
    <Row>
      <Col size={8}>
        <p
          className="u-no-margin--bottom u-no-max-width"
          data-test="delete-message"
        >
          <Icon name="error" className="is-inline" />
          {message}
        </p>
      </Col>
      <Col size={4} className="u-align--right">
        <Button
          appearance="base"
          data-test="close-confirm-delete"
          onClick={closeForm}
        >
          Cancel
        </Button>
        {deleteButton}
      </Col>
    </Row>
  );
};

export default DeleteDomainForm;
