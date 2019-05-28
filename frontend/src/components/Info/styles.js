import styled from 'styled-components';

export const InfoOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: black;
  z-index: -1;
  opacity: 0;
  border-radius: 30px;
  transition: opacity 300ms ease;
  ${props =>
    props.isVisible &&
    `
      opacity: 0.7;
      z-index: 1000;
  `}
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
  z-index: -1;
  padding: 3em;
  opacity: 0;
  ${props =>
    props.isVisible &&
    `
      opacity: 1;
      z-index: 2000;
  `}
`;

export const Link = styled.a`
  text-decoration: underline;
  color: white;
  cursor: pointer;
`;
