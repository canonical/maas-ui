import { useEffect, useState } from "react";

import { Button, Row, Col } from "@canonical/react-components";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";

import ZoneDetailsContent from "./ZoneDetailsContent";
import ZoneDetailsForm from "./ZoneDetailsForm";
import ZoneDetailsHeader from "./ZoneDetailsHeader";

import ModelNotFound from "app/base/components/ModelNotFound";
import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";
import type { RouteParams } from "app/base/types";
import authSelectors from "app/store/auth/selectors";
import type { RootState } from "app/store/root/types";
import { actions as zoneActions } from "app/store/zone";
import zoneSelectors from "app/store/zone/selectors";
import zoneURLs from "app/zones/urls";

const ZoneDetails = (): JSX.Element => {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const { id } = useParams<RouteParams>();
  const zoneID = Number(id);
  const isAdmin = useSelector(authSelectors.isAdmin);
  const zonesLoading = useSelector(zoneSelectors.loading);
  const zone = useSelector((state: RootState) =>
    zoneSelectors.getById(state, zoneID)
  );
  useWindowTitle(zone?.name ?? "Loading...");

  useEffect(() => {
    dispatch(zoneActions.fetch());
  }, [dispatch]);

  if (!zonesLoading && !zone) {
    return <ModelNotFound id={id} linkURL={zoneURLs.index} modelName="zone" />;
  }

  return (
    <Section header={<ZoneDetailsHeader id={zoneID} />}>
      {showForm ? (
        <ZoneDetailsForm
          id={zoneID}
          closeForm={() => {
            setShowForm(false);
          }}
        />
      ) : (
        <Row>
          <Col size={6}>
            <ZoneDetailsContent id={zoneID} />
          </Col>
          {isAdmin && (
            <Col size={6} className="u-align--right">
              <Button data-test="edit-zone" onClick={() => setShowForm(true)}>
                Edit
              </Button>
            </Col>
          )}
        </Row>
      )}
    </Section>
  );
};

export default ZoneDetails;
