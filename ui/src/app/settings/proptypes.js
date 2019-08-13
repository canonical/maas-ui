import { PropTypes } from "prop-types";

export const RepositoryShape = PropTypes.shape({
  arches: PropTypes.arrayOf(PropTypes.string).isRequired,
  components: PropTypes.array.isRequired,
  created: PropTypes.string.isRequired,
  default: PropTypes.bool,
  disable_sources: PropTypes.bool,
  disabled_components: PropTypes.array.isRequired,
  disabled_pockets: PropTypes.array.isRequired,
  distributions: PropTypes.array.isRequired,
  enabled: PropTypes.bool,
  id: PropTypes.number.isRequired,
  key: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  updated: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
});

export const extendFormikShape = values => {
  let touchedShape = {};
  Object.keys(values).forEach(key => {
    touchedShape[key] = PropTypes.bool;
  });
  return {
    formikProps: PropTypes.shape({
      errors: PropTypes.shape(values).isRequired,
      handleBlur: PropTypes.func.isRequired,
      handleChange: PropTypes.func.isRequired,
      handleSubmit: PropTypes.func.isRequired,
      isSubmitting: PropTypes.bool,
      touched: PropTypes.shape(touchedShape).isRequired,
      values: PropTypes.shape(values).isRequired
    })
  };
};
