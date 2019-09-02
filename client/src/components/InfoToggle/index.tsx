import React from 'react';
import ToggleStyled from './styles';

type Props = {
  isVisible: boolean;
  setVisibility: (isVisible: boolean) => void;
};

const InfoToggle: React.FC<Props> = ({ isVisible, setVisibility }) => (
  <ToggleStyled
    isVisible={isVisible}
    onClick={() => setVisibility(!isVisible)}
    tabIndex={0}
    role="button"
  >
    {isVisible ? 'X' : '?'}
  </ToggleStyled>
);

export default InfoToggle;
