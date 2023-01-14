import React from 'react'
import styled from 'styled-components'

const Error = styled.p`
  && {
    color: #dc3545;
  }
`

export const TechnicalError = () => <Error>Technical Error</Error>
