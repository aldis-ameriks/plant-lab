import styled from 'styled-components';

export const InfoOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: black;
  z-index: 1000;
  opacity: ${props => (props.isVisible ? '0.7' : '0')};
  border-radius: 30px;
  transition: opacity 300ms ease;
`;

export const TextWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  color: white;
  font-size: 1.5em;
  text-align: center;
  transition: opacity 300ms ease;
  z-index: 2000;
  padding: 3em;
  opacity: ${props => (props.isVisible ? 1 : 0)};
`;

export const Link = styled.a`
  text-decoration: underline;
  color: white;
  cursor: pointer;
`;
