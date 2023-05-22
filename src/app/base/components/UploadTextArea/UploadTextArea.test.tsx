```
import { render, screen } from 'testing/utils';
import { Formik } from 'formik';
import UploadTextArea from './UploadTextArea';
import { waitFor } from '@testing-library/react';

class MockFileReader {
  result: string;
  constructor() {
    this.result = 'test file content';
  }
  onabort = () => undefined;
  onerror = () => undefined;
  onloadend = () => undefined;
  readAsText() {
    this.onloadend();
  }
}

const createFile = (name: string, size: number, type: string, contents = '') => {
  const file = new File([contents], name, { type });
  Reflect.defineProperty(file, 'size', {
    get() {
      return size;
    },
  });
  return file;
};

describe('UploadTextArea', () => {
  beforeEach(async () => {
    const mockedFileReader = jest.spyOn(window, 'FileReader');
    (mockedFileReader as jest.Mock).mockImplementation(() => new MockFileReader());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('accepts files of any mimetype', async () => {
    const files = [createFile('foo.sh', 2000, '')];
    render(
      <Formik initialValues={{ key: '' }} onSubmit={jest.fn()}>
        <UploadTextArea label="Upload" name="key" />
      </Formik>
    );
    const input = screen.getByLabelText(/^Upload$/i);
    userEvent.upload(input, files);
    await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
  });

  it('displays an error if a file is larger than max size', async () => {
    const files = [createFile('foo.sh', 2000000, '')];
    render(
      <Formik initialValues={{ key: '' }} onSubmit={jest.fn()}>
        <UploadTextArea label="Upload" maxSize={1000000} name="key" />
      </Formik>
    );
    const input = screen.getByLabelText(/^Upload$/i);
    userEvent.upload(input, files);
    await waitFor(() =>
      expect(screen.getByText(/File cannot be larger than 1MB./i)).toBeInTheDocument()
    );
  });

  it('can populate the textarea from the file', async () => {
    const files = [createFile('foo.sh', 2000, 'text/script')];
    render(
      <Formik initialValues={{ key: '' }} onSubmit={jest.fn()}>
        <UploadTextArea label="Upload" name="key" />
      </Formik>
    );
    const input = screen.getByLabelText(/^Upload$/i);
    userEvent.upload(input, files);
    await waitFor(() => expect(screen.getByRole('textbox')).toHaveValue('test file content'));
  });

  it('clears errors on textarea change', async () => {
    const files = [createFile('foo.sh', 2000000, 'text/script')];
    render(
      <Formik initialValues={{ key: '' }} onSubmit={jest.fn()}>
        <UploadTextArea label="Upload" maxSize={1000000} name="key" />
      </Formik>
    );
    // Create a max size error
    const input = screen.getByLabelText(/^Upload$/i);
    userEvent.upload(input, files);
    await waitFor(() =>
      expect(screen.getByText(/File cannot be larger than 1MB./i)).toBeInTheDocument()
    );

    // Clear error by changing textarea
    const textarea = screen.getByRole('textbox') as HTMLInputElement;
    userEvent.type(textarea, 'new-value');
    await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
  });
});

```;
