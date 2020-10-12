import React from 'react'
import styled from 'styled-components'
import { FixedSizeList as List } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import AutoSizer from 'react-virtualized-auto-sizer'
import { useSWRInfinite } from 'swr'

import StarWarsPlanetCard from '../components/StarWarsPlanetCard'
import fetch from '../utils/fetch'
import { StarWarsPlanets } from '../types/types'

const Button = styled.button`
  background: palevioletred;
  color: white;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
`
const StyledStarWarsLogo = styled.img`
  height: 20vmin;
  pointer-events: none;
`

const StyledHeader = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyledAutoSizeWrapper = styled.div`
  flex: 1 1 auto;
`

const StyledApp = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`

const InfiniteWrapper = ({
  hasNextPage,

  isNextPageLoading,

  items,

  loadNextPage,
}: {
  hasNextPage: boolean
  isNextPageLoading: boolean
  items: any[]
  loadNextPage: () => {}
}) => {
  const itemCount = hasNextPage ? items.length + 1 : items.length
  const loadMoreItems = isNextPageLoading ? () => null : loadNextPage
  const isItemLoaded = (index: number) => !hasNextPage || index < items.length
  const [switchImageSrc, setSwitchImgSrc] = React.useState('NEXT')

  const Item = ({
    index,
    style,
  }: {
    index: number
    style: React.CSSProperties
  }) => {
    if (!isItemLoaded(index)) {
      return <div style={style}>Loading...</div>
    } else {
      const starWarsPlanetData = items[index]
      return (
        <div style={style}>
          <StarWarsPlanetCard
            isNextImage={switchImageSrc === 'NEXT'}
            {...starWarsPlanetData}
          ></StarWarsPlanetCard>
        </div>
      )
    }
  }

  return (
    <StyledAutoSizeWrapper>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          onClick={() => {
            if (switchImageSrc === 'STANDARD') {
              setSwitchImgSrc('NEXT')
            } else {
              setSwitchImgSrc('STANDARD')
            }
          }}
        >
          {switchImageSrc}
        </Button>
      </div>

      <AutoSizer disableHeight>
        {({ width }: { width: number }) => (
          <InfiniteLoader
            isItemLoaded={isItemLoaded}
            itemCount={itemCount}
            loadMoreItems={loadMoreItems}
          >
            {({ onItemsRendered, ref }) => (
              <List
                height={800}
                itemCount={itemCount}
                itemSize={300}
                layout="horizontal"
                onItemsRendered={onItemsRendered}
                ref={ref}
                width={width}
              >
                {Item}
              </List>
            )}
          </InfiniteLoader>
        )}
      </AutoSizer>
    </StyledAutoSizeWrapper>
  )
}

const addRandomImageToData = (data: StarWarsPlanets) => {
  return data.results.map((resultData) => {
    const randomImageIndex = Math.floor(Math.random() * 15) + 1
    const randomImageSource = `/images/planet-${randomImageIndex}.jpg`
    return { ...resultData, imageSrc: randomImageSource }
  })
}

const MAX_PAGE = 100
const MAX_SIZE = 6
const START_PAGE = 1

const App = () => {
  const { data, error, size, setSize } = useSWRInfinite(
    (index) => `https://swapi.dev/api/planets/?page=${index + START_PAGE}`,
    fetch,
    {
      revalidateOnFocus: false,
    }
  )
  const starWarsPlanets = data
    ? [].concat(
        ...data.map((data) => {
          return addRandomImageToData(data)
        })
      )
    : []
  const isLoadingInitialData = !data && !error
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === 'undefined')
  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < MAX_PAGE)

  if (error) return <div>failed to load {JSON.stringify(error)}</div>

  return (
    <div>
      <StyledHeader>
        <StyledStarWarsLogo
          height={250}
          src={'./star-wars-logo.svg'}
          alt="star-wars-logo"
        />
      </StyledHeader>

      <main>
        <StyledApp>
          <InfiniteWrapper
            hasNextPage={!isReachingEnd}
            isNextPageLoading={isLoadingMore}
            items={starWarsPlanets}
            loadNextPage={() =>
              setSize((size) => {
                if (size === MAX_SIZE) {
                  return 1
                } else {
                  return size + 1
                }
              })
            }
          ></InfiniteWrapper>
        </StyledApp>
      </main>
    </div>
  )
}

export const Home = (): JSX.Element => <App></App>

export default Home
