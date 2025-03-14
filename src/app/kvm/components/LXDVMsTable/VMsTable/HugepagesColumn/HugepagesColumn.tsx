type Props = {
  hugepagesBacked: boolean;
};

const HugepagesColumn = ({ hugepagesBacked }: Props) => {
  return <span>{hugepagesBacked ? "Enabled" : ""}</span>;
};

export default HugepagesColumn;
