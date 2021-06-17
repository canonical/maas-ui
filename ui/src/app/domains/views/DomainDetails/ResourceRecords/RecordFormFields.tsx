import { Col, Row, Select } from "@canonical/react-components";
import { useFormikContext } from "formik";

import type { CreateRecordValues } from "../DomainDetailsHeader/AddRecordDomainForm/AddRecordDomainForm";

import FormikField from "app/base/components/FormikField";
import { RecordType } from "app/store/domain/types/base";

const recordTypeOptions = [
  { value: "", label: "Type", disabled: true },
  ...Object.values(RecordType).map((value) => {
    return {
      value: value,
      label: value,
    };
  }),
];

const getRecordDataHelp = (type: RecordType | "") => {
  switch (type) {
    case RecordType.A:
      return "A records require an IPv4 address.";
    case RecordType.AAAA:
      return "AAAA records require an IPv6 address.";
    case RecordType.CNAME:
      return "CNAME records require a canonical domain name.";
    case RecordType.MX:
      return 'MX records require "<preference> <domain name>" of a mail server.';
    case RecordType.NS:
      return "NS records require the domain name of a name server.";
    case RecordType.SRV:
      return 'SRV records require "<priority> <weight> <port> <target>" of a server.';
    case RecordType.SSHPF:
      return 'SSHPF records require "<algorithm> <fptype> <fingerprint>".';
    default:
      return "";
  }
};

const getRecordDataPlaceholder = (type: RecordType | "") => {
  switch (type) {
    case RecordType.A:
      return "e.g. 192.168.1.1";
    case RecordType.AAAA:
      return "e.g. 001:db8::ff00:42:8329";
    case RecordType.CNAME:
      return "e.g. www.mydomain.com";
    case RecordType.MX:
      return "e.g. 0 mymailserver.example.com";
    case RecordType.NS:
      return "e.g. ns1.domain.com.";
    case RecordType.SRV:
      return "e.g. 0 5 5060 service.example.com";
    case RecordType.SSHPF:
      return "e.g. 2 1 123456789abcdef67890123456789abcdef67890";
    default:
      return "";
  }
};

const RecordFormFields = (): JSX.Element => {
  const { values } = useFormikContext<CreateRecordValues>();

  return (
    <Row>
      <Col size="6">
        <FormikField
          label="Name"
          type="text"
          name="name"
          placeholder="Name"
          required
        />
        <FormikField
          component={Select}
          name="rrtype"
          label="Record type"
          options={recordTypeOptions}
          required
        />
        <FormikField
          help={getRecordDataHelp(values.rrtype)}
          label="Data"
          placeholder={getRecordDataPlaceholder(values.rrtype)}
          type="text"
          name="rrdata"
          required
        />
        <FormikField
          label="TTL"
          type="number"
          min={0}
          name="ttl"
          placeholder="TTL in seconds (optional)"
        />
      </Col>
    </Row>
  );
};

export default RecordFormFields;
