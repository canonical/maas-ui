import type { ComponentType, PropsWithChildren, ReactElement } from "react";
import { useContext, createContext, useState } from "react";

// This new side panel context is meant to replace the old one over time. Since migrating all
// panels will take some time, these two contexts will live together while the migrations are
// being carried out.
// TODO: Once the migrations are complete, remove the old side panel context.

type SidePanelSize = "large" | "narrow" | "regular" | "wide";

interface SidePanelState<TProps = Record<string, unknown>> {
  isOpen: boolean;
  title: string;
  size: SidePanelSize;
  component: ComponentType<TProps> | null;
  props: TProps;
}

interface SidePanelActions {
  open: <TProps extends Record<string, unknown> = Record<string, unknown>>(
    component: ComponentType<TProps>,
    title: string,
    props?: TProps,
    size?: SidePanelSize
  ) => void;
  close: () => void;
  setSize: (size: SidePanelSize) => void;
}

type SidePanelContextValue = SidePanelActions & SidePanelState;

const SidePanelContext = createContext<SidePanelContextValue | null>(null);

export const useSidePanel = (): SidePanelContextValue => {
  const context = useContext(SidePanelContext);
  if (!context) {
    throw new Error("useSidePanel must be used within a SidePanelProvider");
  }
  return context;
};

const SidePanelContextProvider = ({
  children,
}: PropsWithChildren): ReactElement => {
  const [state, setState] = useState<SidePanelState>({
    isOpen: false,
    title: "",
    size: "regular",
    component: null,
    props: {},
  });

  const open = <
    TProps extends Record<string, unknown> = Record<string, unknown>,
  >(
    component: ComponentType<TProps>,
    title: string,
    props: TProps = {} as TProps,
    size: SidePanelSize = "regular"
  ) => {
    setState({
      isOpen: true,
      title,
      size,
      component: component as ComponentType<Record<string, unknown>>,
      props: props || ({} as Record<string, unknown>),
    });
  };

  const close = () => {
    setState((prev) => ({
      ...prev,
      isOpen: false,
      size: "regular",
      props: {},
    }));
  };

  const setSize = (size: SidePanelSize) => {
    setState((prev) => ({ ...prev, size }));
  };

  return (
    <SidePanelContext.Provider
      value={{
        ...state,
        open,
        close,
        setSize,
      }}
    >
      {children}
    </SidePanelContext.Provider>
  );
};

export default SidePanelContextProvider;
