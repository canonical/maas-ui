export type SubnetSummaryFormValues = {
  name: string;
  cidr: string;
  gateway_ip: string;
  dns_servers: string;
  description: string;
  managed: boolean;
  active_discovery: boolean;
  allow_proxy: boolean;
  allow_dns: boolean;
  vlan: number;
  fabric: number | undefined;
};
