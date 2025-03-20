type Props = {
  hugepagesBacked: boolean;
};

const HugepagesColumn = ({ hugepagesBacked }: Props): React.ReactElement => {
  return <span>{hugepagesBacked ? "Enabled" : ""}</span>;
};

export default HugepagesColumn;
