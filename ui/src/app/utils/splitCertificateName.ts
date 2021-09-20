import type { GeneratedCertificate } from "app/store/general/types";
import type { PodCertificate } from "app/store/pod/types";

export const splitCertificateName = (
  certificate: GeneratedCertificate | PodCertificate | null
): { name: string; host: string } | null => {
  if (!certificate) {
    return null;
  }
  const split = certificate.CN.split("@");
  if (split.length < 2) {
    return { name: certificate.CN, host: "" };
  }
  const host = split[split.length - 1];
  const name = split.slice(0, split.length - 1).join("@");
  return { name, host };
};
