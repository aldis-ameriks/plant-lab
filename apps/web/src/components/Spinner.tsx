import React, { HTMLAttributes } from 'react'
import styled, { keyframes } from 'styled-components'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

const Wrapper = styled.div`
  display: inline-block;
  width: 1.75rem;
  height: 1.75rem;
  vertical-align: text-bottom;
  border: 0.2em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: ${rotate} 0.75s linear infinite;
`

export const Spinner = (props: HTMLAttributes<HTMLDivElement>) => <Wrapper {...props} />
