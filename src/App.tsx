import React from 'react';
import logo from './star-wars-logo.svg';
import styled from 'styled-components';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import AutoSizer from 'react-virtualized-auto-sizer';
import useSWR from 'swr';

import StarWarsPlanetCard from './Components/StarWarsPlanetCard';
import fetch from './utils/fetch';
import { StarWarsPlanets } from './types';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: white;
    margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  }
  .App {
  text-align: center;
}
`;

const StyledStarWarsLogo = styled.img`
  height: 20vmin;
  pointer-events: none;
`;

const StyledHeader = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledAutoSizeWrapper = styled.div`
  flex: 1 1 auto;
`;

const StyledApp = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const InfiniteWrapper = ({
  hasNextPage,

  isNextPageLoading,

  items,

  loadNextPage,
}: {
  hasNextPage: boolean;
  isNextPageLoading: boolean;
  items: any;
  loadNextPage: any;
}) => {
  const itemCount = hasNextPage ? items.length + 1 : items.length;
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;
  const isItemLoaded = (index: number) => !hasNextPage || index < items.length;

  // Render an item or a loading indicator.
  const Item = ({ index, style }: { index: number; style: any }) => {
    if (!isItemLoaded(index)) {
      return <div style={style}>Loading...</div>;
    } else {
      const starWarsPlanetData = items[index];
      return (
        <div style={style}>
          <StarWarsPlanetCard {...starWarsPlanetData}></StarWarsPlanetCard>
        </div>
      );
    }
  };

  return (
    <StyledAutoSizeWrapper>
      <AutoSizer disableHeight>
        {({ width }: { width: number }) => (
          <InfiniteLoader isItemLoaded={isItemLoaded} itemCount={itemCount} loadMoreItems={loadMoreItems}>
            {({ onItemsRendered, ref }) => (
              <List
                height={800}
                itemCount={itemCount}
                itemSize={300}
                layout='horizontal'
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
  );
};

const addRandomImageToData = (data: StarWarsPlanets) => {
  return data.results.map((resultData) => {
    const randomImageIndex = Math.floor(Math.random() * 15) + 1;
    const randomImageSource = `${process.env.PUBLIC_URL}/images/planet-${randomImageIndex}.jpg`;
    return { ...resultData, imageSrc: randomImageSource };
  });
};

const MAX_PAGE = 6;
const START_PAGE = 1;

const App = () => {
  const [page, setPage] = React.useState(START_PAGE);
  const { data, error } = useSWR<StarWarsPlanets>(() => `https://swapi.dev/api/planets/?page=${page}`, fetch);
  const [starWarsData, setStarWarsData] = React.useState({
    hasNextPage: data !== undefined && data.next !== undefined ? true : false,
    isNextPageLoading: false,
    items: data !== undefined && data.results ? addRandomImageToData(data) : [],
  });

  React.useEffect(() => {
    setStarWarsData((state) => {
      return {
        ...state,
        hasNextPage: data !== undefined && data.next !== undefined ? true : false,
        items: data !== undefined ? [...state.items].concat(addRandomImageToData(data)) : state.items,
      };
    });
  }, [data]);

  if (error) return <div>failed to load {JSON.stringify(error)}</div>;

  const loadMoreStarWarsData = () => {
    // set loading state
    setStarWarsData((state) => {
      return {
        ...state,
        isNextPageLoading: true,
      };
    });

    // load new data based on new page
    setPage((page) => {
      if (page === MAX_PAGE) {
        return 1;
      }
      return page + 1;
    });

    setStarWarsData((state) => {
      return {
        ...state,
        hasNextPage: state.items.length < 100,
        isNextPageLoading: false,
      };
    });
  };

  return (
    <div>
      <GlobalStyle />
      <StyledHeader>
        <StyledStarWarsLogo src={logo} alt='star-wars-logo' />
      </StyledHeader>
      <main>
        <StyledApp>
          <InfiniteWrapper
            hasNextPage={starWarsData.hasNextPage}
            isNextPageLoading={starWarsData.isNextPageLoading}
            items={starWarsData.items}
            loadNextPage={loadMoreStarWarsData}
          ></InfiniteWrapper>
        </StyledApp>
      </main>
    </div>
  );
};

export default App;
