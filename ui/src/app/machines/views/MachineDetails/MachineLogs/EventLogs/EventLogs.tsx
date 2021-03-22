import { useEffect, useState } from "react";

import { Col, Row, SearchBox, Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import EventLogsTable from "./EventLogsTable";

import { actions as eventActions } from "app/store/event";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";

type Props = { systemId: Machine["system_id"] };

const EventLogs = ({ systemId }: Props): JSX.Element => {
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );

  useEffect(() => {
    if (machine) {
      dispatch(eventActions.fetch(machine.id, 50));
    }
  }, [dispatch, systemId, machine]);

  if (!machine) {
    return <Spinner text="Loading..." />;
  }

  return (
    <>
      <Row className="u-nudge-down--small">
        <Col size="6">
          <SearchBox
            onChange={setSearchText}
            placeholder="Search event logs"
            value={searchText}
          />
        </Col>
        <Col size="6"></Col>
      </Row>
      <hr />
      <EventLogsTable searchText={searchText} systemId={systemId} />
    </>
  );
};

export default EventLogs;
