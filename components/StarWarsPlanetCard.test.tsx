/* eslint-disable @typescript-eslint/camelcase */

import React from 'react'
import { render } from '../test/testUtils'
import StarWarsPlanetCard from './StarWarsPlanetCard'

const StarWarsPlanetExampleData = {
  edited: '2014-12-20T20:58:18.411Z',
  climate: 'arid',
  surface_water: '1',
  name: 'Tatooine',
  diameter: '10465',
  rotation_period: '23',
  created: '2014-12-09T13:50:49.641Z',
  terrain: 'desert',
  gravity: '1 standard',
  orbital_period: '304',
  population: '200000',
  residents: ['aliens'],
  films: [''],
  url: '',
  isNextImage: false,
}
test('renders StarWarsPlanetCard data ', () => {
  const { getByText } = render(
    <StarWarsPlanetCard {...StarWarsPlanetExampleData} />
  )
  const name = getByText(/Tatooine/i)
  const diameter = getByText(/10465/i)
  const terrain = getByText(/desert/i)
  const gravity = getByText(/1 standard/i)
  const population = getByText(/population/i)
  expect(name).toBeInTheDocument()
  expect(name).toBeInTheDocument()
  expect(diameter).toBeInTheDocument()
  expect(terrain).toBeInTheDocument()
  expect(population).toBeInTheDocument()
  expect(gravity).toBeInTheDocument()
})
