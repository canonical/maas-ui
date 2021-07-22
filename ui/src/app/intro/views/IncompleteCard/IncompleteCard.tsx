import { Card, Icon, Link } from "@canonical/react-components";

const IncompleteCard = (): JSX.Element => {
  return (
    <Card
      className="maas-intro__card"
      data-test="maas-name-form"
      highlighted
      title={
        <>
          <span className="u-flex--between">
            <span className="p-heading--4">
              <Icon name="error" />
              &ensp;Welcome to MAAS
            </span>
            <span className="p-text--default u-text--default-size">
              <Link
                external
                href="https://maas.io/docs/configuration-journey"
                target="_blank"
              >
                Help with configuring MAAS
              </Link>
            </span>
          </span>
          <hr />
        </>
      }
    >
      <p>
        This MAAS has not be configured. Ask an admin to log in and finish the
        configuration.
      </p>
    </Card>
  );
};

export default IncompleteCard;
