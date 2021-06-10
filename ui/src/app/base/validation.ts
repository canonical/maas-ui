/**
 * Validate domain name e.g. "www.example.com"
 * XXX This should be updated as it currently allows e.g. "www.example.com."
 * https://github.com/canonical-web-and-design/maas-ui/issues/2755
 */
export const DOMAIN_NAME_REGEX = /^([a-z\d]|[a-z\d][a-z\d-.]*[a-z\d])*$/i;

/**
 * Validate IPv4 address e.g 192.168.1.1
 */
export const IPV4_REGEX =
  /\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)(?::\d{0,4})?\b/;

/**
 * Validate MAC address e.g 78:9a:bc:de:f0
 */
export const MAC_ADDRESS_REGEX = /^([0-9A-Fa-f]{2}:){5}([0-9A-Fa-f]{2})$/;

/**
 * Validate range string e.g 0-2, 4, 6-7
 */
export const RANGE_REGEX = /^\d{1,3}(-\d{1,3})?(,\s*(\d{1,3}(-\d{1,3})?))*$/;
