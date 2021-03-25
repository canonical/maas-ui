import { useEffect, useState } from "react";

import {
  Col,
  Link,
  Row,
  SearchBox,
  Select,
  Spinner,
} from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useStorageState } from "react-storage-hooks";

import EventLogsTable from "./EventLogsTable";

import ArrowPagination from "app/base/components/ArrowPagination";
import { actions as eventActions } from "app/store/event";
import eventSelectors from "app/store/event/selectors";
import type { EventRecord } from "app/store/event/types";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";

type Props = { systemId: Machine["system_id"] };

// The amount of events to preload. This is 1 more than would fit on a page so
// that the next page arrow appears.
const PRELOAD_COUNT = 201;

const filterEvents = (events: EventRecord[], searchText: string) => {
  const lowerSearchText = searchText?.toLowerCase();
  return lowerSearchText
    ? events.filter(
        (eventRecord) =>
          eventRecord.description?.toLowerCase().includes(lowerSearchText) ||
          eventRecord.type?.description?.toLowerCase().includes(lowerSearchText)
      )
    : [...events];
};

const getPageEvents = (
  events: EventRecord[],
  pageSize: number,
  startIndex: number
) => {
  return events
    .sort(
      (a: EventRecord, b: EventRecord) =>
        new Date(b.created).getTime() - new Date(a.created).getTime()
    )
    .slice(startIndex, startIndex + pageSize);
};

const EventLogs = ({ systemId }: Props): JSX.Element => {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [requestedDay, setRequestedDay] = useState(false);
  const [requestedCount, setRequestedCount] = useState(false);
  const [lastRequested, setLastRequested] = useState<number | null>(null);
  const dispatch = useDispatch();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const events = useSelector((state: RootState) =>
    eventSelectors.getByNodeId(state, machine?.id)
  );
  const loading = useSelector(eventSelectors.loading);
  const [pageSize, setPageSize] = useStorageState(
    localStorage,
    "eventLogPageSize",
    25
  );
  const unpaginatedEvents = filterEvents(events, searchText);
  const startIndex = (currentPage - 1) * pageSize;
  if (startIndex > unpaginatedEvents.length) {
    // If the rows have changed e.g. when filtering and the user is on a page
    // that no longer exists then send them to the start.
    setCurrentPage(1);
  }
  const paginatedEvents = getPageEvents(
    unpaginatedEvents,
    pageSize,
    startIndex
  );
  // Check the number of events on this page not the page size in case there are
  // less items.
  const showBackToTop = paginatedEvents.length >= 50;

  useEffect(() => {
    // If the events haven't been requested yet then get all the events for the
    // last day.
    if (machine && !requestedDay) {
      dispatch(eventActions.fetch(machine.id, null, null, 1));
      setRequestedDay(true);
    }
  }, [dispatch, machine, requestedDay, setRequestedDay]);

  useEffect(() => {
    // If the events have been requested but less than the preload amount were
    // returned then request the preload number of events.
    if (
      machine &&
      requestedDay &&
      !requestedCount &&
      events.length < PRELOAD_COUNT
    ) {
      dispatch(eventActions.fetch(machine.id, PRELOAD_COUNT));
      setRequestedCount(true);
    }
  }, [
    dispatch,
    events,
    machine,
    requestedCount,
    requestedDay,
    setRequestedCount,
    setRequestedDay,
  ]);

  useEffect(() => {
    const onLastPage =
      events.length === 0 ||
      currentPage === Math.ceil(events.length / pageSize);
    const lastItem = events?.[events.length - 1];
    const alreadyRequested = events.length && lastRequested === lastItem.id;
    // There's no need to fetch more events if the initial preload hasn't
    // happend or if it returned less events than requested.
    const initialEventsLoaded = events.length >= PRELOAD_COUNT;

    // Once the last page is reached then fetch more events.
    if (machine && initialEventsLoaded && onLastPage && !alreadyRequested) {
      dispatch(eventActions.fetch(machine.id, PRELOAD_COUNT, lastItem.id));
      setLastRequested(lastItem.id);
    }
  }, [
    dispatch,
    machine,
    currentPage,
    events,
    lastRequested,
    pageSize,
    setLastRequested,
  ]);

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
        <Col className="u-align--right" size="6">
          Show
          <Select
            className="u-auto-width"
            defaultValue={pageSize.toString()}
            name="page-size"
            onChange={(evt: React.ChangeEvent<HTMLSelectElement>) => {
              setPageSize(Number(evt.target.value));
            }}
            options={[
              {
                value: "25",
                label: "25",
              },
              {
                value: "50",
                label: "50",
              },
              {
                value: "100",
                label: "100",
              },
              {
                value: "200",
                label: "200",
              },
            ]}
            wrapperClassName="u-display-inline-block u-nudge-right"
          />
          <ArrowPagination
            className="u-display-inline-block u-nudge-right"
            currentPage={currentPage}
            itemCount={unpaginatedEvents.length}
            pageSize={pageSize}
            setCurrentPage={setCurrentPage}
          />
        </Col>
      </Row>
      <hr />
      <EventLogsTable events={paginatedEvents} systemId={systemId} />
      {loading && <Spinner text="Loading..." />}
      {showBackToTop && (
        <Link
          data-test="backToTop"
          onClick={(evt: React.MouseEvent<HTMLAnchorElement>) => {
            evt.preventDefault();
            window.scrollTo({
              top: 0,
              left: 0,
              behavior: "smooth",
            });
          }}
          top
        >
          Back to top
        </Link>
      )}
    </>
  );
};

export default EventLogs;
