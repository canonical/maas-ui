```import { render } from '@testing-library/react';
import { userEvent, renderWithBrowserRouter, screen } from 'testing/utils';
import configureStore from 'redux-mock-store';
import DeviceListControls from './DeviceListControls';
import { rootState as rootStateFactory } from 'testing/factories';

const mockStore = configureStore();

describe('DeviceListControls', () => {
  let initialState = rootStateFactory();

  it('changes the search text when the filters change', () => {
    const store = mockStore(initialState);
    const Proxy = ({ filter }: { filter: string }) => (
      renderWithBrowserRouter(
            <DeviceListControls filter={filter} setFilter={jest.fn()} />,
          { route: '/machines?q=test+search', store }
          )
    );
    const wrapper = render(<Proxy filter="" />);
    expect(screen.getByTestId('search-box').value).toBe('');

    userEvent.type(screen.getByTestId('search-box'), 'free-text');
    expect(screen.getByTestId('search-box')).toHaveValue('free-text');
  });
});```;
