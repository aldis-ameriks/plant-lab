import styled from 'styled-components';

const ToggleStyled = styled.button`
  position: absolute;
  cursor: pointer;
  top: 5px;
  right: 10px;
  z-index: 3000;
  ${props => props.isVisible && 'color: white'};
  background-color: transparent;
  padding: 0.5em;
  font-size: 1.5em;
  border: 3px solid transparent;

  :focus {
    border: 3px solid #a0a0a0;
    border-radius: 5px;
  }
`;

export default ToggleStyled;
