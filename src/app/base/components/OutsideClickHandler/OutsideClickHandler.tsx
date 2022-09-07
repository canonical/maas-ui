import { useEffect, useRef } from "react";

const OutsideClickHandler = ({
  children,
  onClick,
}: React.PropsWithChildren<{
  onClick: () => void;
}>): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  const handleClickOutside = ({ target }: MouseEvent) => {
    if (ref.current && !ref.current?.contains(target as HTMLElement)) {
      onClick();
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });
  return <div ref={ref}>{children}</div>;
};

export default OutsideClickHandler;
