import { useEffect } from "react";

import { Card, Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import type { ControllerDetails } from "app/store/controller/types";
import type { RootState } from "app/store/root/types";
import { actions as serviceActions } from "app/store/service";
import serviceSelectors from "app/store/service/selectors";

type Props = {
  controller: ControllerDetails;
};

const ServicesCard = ({ controller }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const services = useSelector((state: RootState) =>
    serviceSelectors.getByIDs(state, controller.service_ids)
  );
  const servicesLoading = useSelector(serviceSelectors.loading);

  useEffect(() => {
    dispatch(serviceActions.fetch());
  }, [dispatch]);

  return (
    <Card>
      <strong className="p-muted-heading u-sv1">Services</strong>
      <hr />
      {servicesLoading ? (
        <Spinner aria-label="Loading services" text="Loading..." />
      ) : (
        <ul>
          {services.map((service) => (
            <li key={service.id}>{service.name}</li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default ServicesCard;
