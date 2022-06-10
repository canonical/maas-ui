type Props = {
  hugepagesBacked: boolean;
};

const HugepagesColumn = ({ hugepagesBacked }: Props): JSX.Element => {
  return <span>{hugepagesBacked ? "Enabled" : ""}</span>;
};

export default HugepagesColumn;
