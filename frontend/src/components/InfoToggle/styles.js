import styled from 'styled-components';

export const ToggleStyled = styled.button`
  position: absolute;
  cursor: pointer;
  right: 25px;
  z-index: 3000;
  ${props => props.isVisible && 'color: white'};
  background-color: transparent;
  padding: 0.5em;
  font-size: 1em;
  border: 3px solid transparent;

  :focus {
    border: 3px solid #a0a0a0;
    border-radius: 5px;
  }
`;
