import React from 'react';
import PropTypes from 'prop-types';
import { ToggleStyled } from './styles';

const InfoToggle = ({ isVisible, setVisibility }) => (
  <ToggleStyled
    isVisible={isVisible}
    onClick={() => setVisibility(!isVisible)}
    tabIndex="0"
    role="button"
  >
    {isVisible ? 'X' : '?'}
  </ToggleStyled>
);

InfoToggle.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  setVisibility: PropTypes.func.isRequired,
};

export default InfoToggle;
