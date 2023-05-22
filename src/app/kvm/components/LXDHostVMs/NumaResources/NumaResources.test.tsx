import { renderWithBrowserRouter, screen } from 'testing/utils';
import configureStore from 'redux-mock-store';
import NumaResources, { TRUNCATION_POINT } from './NumaResources';
import * as hooks from 'app/base/hooks/analytics';
import { ConfigNames } from 'app/store/config/types';
import { podFactory, podNumaFactory, podResourcesFactory, podStateFactory, rootStateFactory } from 'testing/factories';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockStore = configureStore();

describe('NumaResources', () => {
  it('can expand truncated NUMA nodes if above truncation point', async () => {
    const pod = podFactory({
      id: 1,
      resources: podResourcesFactory({
        numa: Array.from(Array(TRUNCATION_POINT + 1)).map(() => podNumaFactory()),
      }),
    });
    
    const state = rootStateFactory({ pod: podStateFactory({ items: [pod] }) });
    
    const store = mockStore(state);
    
    renderWithBrowserRouter(<NumaResources id={pod.id} />, { route: "/kvm/1", store });
    
    expect(screen.getByTestId('show-more-numas')).toBeInTheDocument();
    
    expect(screen.getAllByTestId('numa-resources-card').length).toBe(TRUNCATION_POINT);
    
    userEvent.click(screen.getByTestId('show-more-numas'));
    await waitFor(() => expect(screen.getByTestId('show-more-numas-span')).toHaveTextContent('Show less NUMA nodes'));
    
    expect(screen.getAllByTestId('numa-resources-card').length).toBe(TRUNCATION_POINT + 1);
  });
  
  it('shows wide cards if the pod has less than or equal to 2 NUMA nodes', () => {
    const pod = podFactory({
      id: 1,
      resources: podResourcesFactory({
        numa: [podNumaFactory()],
      }),
    });
    
    const state = rootStateFactory({ pod: podStateFactory({ items: [pod] }) });
    
    const store = mockStore(state);
    
    renderWithBrowserRouter(<NumaResources id={pod.id} />, { route: "/kvm/1", store });

    expect(screen.getByTestId('numa-resource-card').classList.contains('is-wide')).toBe(true);
  });
  
  it('can send an analytics event when expanding NUMA nodes if analytics enabled', async () => {
    const pod = podFactory({
      id: 1,
      resources: podResourcesFactory({
        numa: Array.from(Array(TRUNCATION_POINT + 1)).map(() => podNumaFactory()),
      }),
    });
    
    const state = rootStateFactory({
      config: {
        items: [
          {
            name: ConfigNames.ENABLE_ANALYTICS,
            value: false,
          },
        ],
      },
      pod: podStateFactory({ items: [pod] }),
    });
    
    const useSendMock = jest.spyOn(hooks, 'useSendAnalytics');
    
    const store = mockStore(state);
    
    renderWithBrowserRouter(<NumaResources id={pod.id} />, { route: "/kvm/1", store });

    userEvent.click(screen.getByTestId('show-more-numas'));
    await waitFor(() => expect(screen.getByTestId('show-more-numas-span')).toHaveTextContent('Show less NUMA nodes'));
    
    expect(useSendMock).toHaveBeenCalled();
    useSendMock.mockRestore();
  });
});

Note: I had to make a couple of small changes to the code to make it work with testing-library/react. The "Button" component is not utilized, so I removed the corresponding imports.