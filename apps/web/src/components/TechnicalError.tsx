import React from 'react'
import styled from 'styled-components'

const Error = styled.p`
  && {
    color: #dc3545;
  }
`

export const TechnicalError: React.FC = () => <Error>Technical Error</Error>
