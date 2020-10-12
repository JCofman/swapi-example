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
      const starWarsPlanetData = items[index].fields;
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
  return data.map((data) => {
    const randomImageIndex = Math.floor(Math.random() * 15) + 1;
    const randomImageSource = `http://localhost:3000/images/planet-${randomImageIndex}.jpg`;
    return { ...data, fields: { ...data.fields, imageSrc: randomImageSource } };
  });
};

const App = () => {
  const { data, error } = useSWR<StarWarsPlanets>('/planets.json', fetch);
  const [starWarsData, setStarWarsData] = React.useState({
    hasNextPage: true,
    isNextPageLoading: false,
    items: data !== undefined ? addRandomImageToData(data) : [],
  });

  React.useEffect(() => {
    setStarWarsData((state) => {
      return {
        ...state,
        items: data !== undefined ? addRandomImageToData(data) : [],
      };
    });
  }, [data]);

  if (error) return <div>failed to load {JSON.stringify(error)}</div>;
  if (!data || !starWarsData.items) return <div>loading...</div>;

  const loadMoreStarWarsData = () => {
    // set loading state
    setStarWarsData((state) => {
      return {
        ...state,
        isNextPageLoading: true,
      };
    });
    // load new data
    setTimeout(() => {
      setStarWarsData((state) => ({
        hasNextPage: state.items.length < 100,
        isNextPageLoading: false,
        items: [...state.items].concat(...state.items),
      }));
    }, 100);
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
