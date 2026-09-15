import { createContext, lazy, Suspense, useContext, useState } from "react";
import type { ComponentType, PropsWithChildren, ReactElement } from "react";

import { ContentSection, Placeholder } from "@canonical/maas-react-components";

type ModalState<TProps = Record<string, unknown>> = {
  isOpen: boolean;
  title: string;
  component: ComponentType<TProps> | null;
  props: TProps;
};

type ModalActions = {
  openModal: <
    TProps extends Record<string, unknown> = Record<string, unknown>,
  >(params: {
    component: ComponentType<TProps>;
    title: string;
    props?: TProps;
  }) => void;
  closeModal: () => void;
};

type ModalContextValue = ModalActions & ModalState;

const ModalContext = createContext<ModalContextValue | null>(null);

/**
 * Hook for managing modal state and actions.
 *
 * Provides methods to open/close modals with React components and manages
 * modal visibility state.
 *
 * @returns Object containing:
 *   - `isOpen`: Boolean indicating if the modal is currently open
 *   - `title`: Current modal title string
 *   - `component`: Currently rendered component
 *   - `props`: Props passed to the current component
 *   - `openModal({component, title, props?})`: Opens modal with given component
 *   - `closeModal()`: Closes the modal and resets state
 *
 * @throws Error when used outside ModalProvider
 *
 * @example
 * ```tsx
 * const { open, close, isOpen } = useModal();
 *
 * // Open a modal with a form component
 * const handleEdit = (userId: number) => {
 *   open(EditUserForm, 'Edit User', { userId }, 'wide');
 * };
 *
 * // Close the modal
 * const handleCancel = () => {
 *   close();
 * };
 * ```
 */
export const useModal = (): ModalContextValue => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalContextProvider");
  }
  return context;
};

/**
 * Provider component for managing modal state and actions.
 *
 * Wraps your application or subtree to provide modal context to all child
 * components. Child components can use the `useModal` hook to access and
 * control the modal.
 *
 * @param children - React elements to render within the provider
 *
 * @returns A React element wrapping children with ModalContext
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <ModalContextProvider>
 *       <MainLayout />
 *     </ModalContextProvider>
 *   );
 * }
 *
 * function MainLayout() {
 *   const { openModal, closeModal, isOpen } = useModal();
 *
 *   return (
 *     <>
 *       <button onClick={() => openModal({
 *         component: UserForm,
 *         title: 'Create User',
 *       })}>
 *         New User
 *       </button>
 *       {isOpen && <Modal />}
 *     </>
 *   );
 * }
 * ```
 */
export const ModalContextProvider = ({
  children,
}: PropsWithChildren): ReactElement => {
  const [state, setState] = useState<ModalState>({
    isOpen: false,
    title: "",
    component: null,
    props: {},
  });

  const openModal = <
    TProps extends Record<string, unknown> = Record<string, unknown>,
  >({
    component,
    title,
    props = {} as TProps,
  }: {
    component: ComponentType<TProps>;
    title: string;
    props?: TProps;
  }) => {
    setState({
      isOpen: true,
      title,
      component: component as ComponentType<Record<string, unknown>>,
      props: props || ({} as Record<string, unknown>),
    });
  };

  const closeModal = () => {
    setState({
      isOpen: false,
      title: "",
      component: null,
      props: {},
    });
  };

  return (
    <ModalContext.Provider
      value={{
        ...state,
        openModal,
        closeModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

/**
 * Lazily loads a modal component wrapped in its own Suspense boundary.
 * Define the modal at module scope in the file that opens it and pass it
 * straight to `openModal`:
 *
 * @example
 * const DeleteUser = lazyLoadModal(() => import("./UserDeleteForm"));
 * // ...
 * openModal({ component: DeleteUser, title: "Delete user" });
 *
 * The `<Modal />` component from `@canonical/maas-react-components` renders
 * the modal component directly, so a bare `React.lazy` modal would suspend the
 * whole `<Modal />` on first open. That remounts `<Modal />`, and on
 * remount its internal "close on navigation" effect runs and immediately closes
 * the modal that was just opened. Giving each modal its own Suspense boundary
 * keeps `<Modal />` mounted (and open) while the chunk loads, and shows the
 * spinner inside the modal.
 */
export const lazyLoadModal = <
  P extends Record<string, unknown> = Record<string, unknown>,
>(
  loader: () => Promise<{ default: ComponentType<P> }>
): ComponentType => {
  const LazyPanel = lazy(loader);
  const SidePanelContent = (props: P) => (
    <Suspense
      fallback={
        <ContentSection>
          <ContentSection aria-hidden="true">
            <ContentSection.Content>
              <div className="layout-skeleton__form-description">
                <Placeholder height="1.5rem" variant="block" width="100%" />
                <Placeholder height="1.5rem" variant="block" width="70%" />
              </div>
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  className="layout-skeleton__form-field"
                  key={`aside-skeleton-field-${index}`}
                >
                  <Placeholder height="1.5rem" variant="block" width="14ch" />
                  <Placeholder height="2.5rem" variant="block" width="100%" />
                </div>
              ))}
            </ContentSection.Content>
            <ContentSection.Footer>
              <Placeholder height="2rem" variant="block" width="8ch" />
              <Placeholder height="2rem" variant="block" width="10ch" />
            </ContentSection.Footer>
          </ContentSection>
        </ContentSection>
      }
    >
      <LazyPanel {...props} />
    </Suspense>
  );
  return SidePanelContent as ComponentType;
};
