import React from 'react'
import styled from 'styled-components'

import { InfoIcon } from '../icons/InfoIcon'
import { TimesIcon } from '../icons/TimesIcon'

const InfoToggleButton = styled.button<{ $isVisible: boolean }>`
  position: absolute;
  cursor: pointer;
  top: 4px;
  right: 10px;
  z-index: 3000;
  ${(props) => props.$isVisible && 'color: white'};
  background-color: transparent;
  padding: 0.5em;
  font-size: 1.5em;
  border: 3px solid transparent;

  :focus {
    border: 3px solid #a0a0a0;
    border-radius: 5px;
  }
`

type Props = {
  isVisible: boolean
  setVisibility: (isVisible: boolean) => void
}

export const InfoToggle = ({ isVisible, setVisibility }: Props) => (
  <InfoToggleButton $isVisible={isVisible} onClick={() => setVisibility(!isVisible)} tabIndex={0} role="button">
    {isVisible ? <TimesIcon color="#8c8c8d" /> : <InfoIcon color="#8c8c8d" />}
  </InfoToggleButton>
)
