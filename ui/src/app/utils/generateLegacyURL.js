export const generateLegacyURL = (url) =>
  `${process.env.REACT_APP_BASENAME}${process.env.REACT_APP_ANGULAR_BASENAME}${url}`;
