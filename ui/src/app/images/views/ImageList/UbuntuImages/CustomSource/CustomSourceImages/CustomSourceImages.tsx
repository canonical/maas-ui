type Props = { sourceUrl: string };

const CustomSourceImages = ({ sourceUrl }: Props): JSX.Element => {
  return (
    <p>
      Showing images available from <strong>{sourceUrl}</strong>
    </p>
  );
};

export default CustomSourceImages;
