import dynamic from 'next/dynamic'
import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'
import { useDevicesQuery } from '../../helpers/graphql'
import { Card, CardSection, CardWrapper, Header, Image, ImageWrapper, Title } from '../device/Device'
import { Spinner } from '../Spinner'

const SensorReadings = dynamic(() => import('../SensorReadings'), { ssr: false })

const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`

const ListCardWrapper = styled(CardWrapper)`
  margin: 2rem 3rem;
  max-width: 600px;
`

const ListCard = styled(Card).attrs(() => ({ as: Link }))<{ href: string }>`
  cursor: pointer;

  @media (min-width: 350px) {
    font-size: 0.8rem;
  }
`

const ListCardSection = styled(CardSection)`
  > div {
    max-width: 350px;
  }

  @media (min-width: 700px) {
    display: flex;
  }
`

const Devices = () => {
  const [{ data, error, fetching }] = useDevicesQuery()

  if (fetching) {
    return <Spinner />
  }

  if (error) {
    return <div>{error.message}</div>
  }

  return (
    <List>
      {data?.devices.map((device) => (
        <ListCardWrapper key={device.id}>
          <ListCard href={`/devices/${device.id}`}>
            <ListCardSection>
              <Header>
                <Title>
                  <h3>Rubber tree</h3>
                  <h5>sensor id: {device.id}</h5>
                </Title>

                <ImageWrapper>
                  <Image src="/plant.jpg" alt="" />
                </ImageWrapper>
              </Header>

              <SensorReadings reading={device.lastReading} lastWateredTime={device.lastWateredTime} />
            </ListCardSection>
          </ListCard>
        </ListCardWrapper>
      ))}
    </List>
  )
}

export default Devices
