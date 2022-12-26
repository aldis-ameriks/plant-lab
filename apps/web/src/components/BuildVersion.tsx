import React, { memo } from 'react'
import styled from 'styled-components'

import { config } from '../config'

const Wrapper = styled.div`
  display: none;
`

export const BuildVersion = memo(() => <Wrapper data-testid="build-version">{config.commitHash}</Wrapper>)
