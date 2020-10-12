import React from 'react';
import logo from './star-wars-logo.svg';
import styled from 'styled-components';
import { FixedSizeList as List } from 'react-window';
import StarWarsPlanetCard from './Components/StarWarsPlanetCard';
import fetch from './utils/fetch';
import { StarWarsPlanets } from './types';
import useSWR from 'swr';

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

const Column = ({ index, style, data }: { index: number; style: any; data: StarWarsPlanets }) => {
  const starWarsPlanetData = data[index].fields;
  return (
    <div style={style}>
      <StarWarsPlanetCard {...starWarsPlanetData}></StarWarsPlanetCard>
    </div>
  );
};

const HorizontalList = ({ data }: { data: any }) => (
  <List itemData={data} height={800} itemCount={data.length} itemSize={300} layout='horizontal' width={1500}>
    {Column}
  </List>
);

const StyledApp = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

function App() {
  const { data, error } = useSWR<StarWarsPlanets>('/planets.json', fetch);

  if (error) return <div>failed to load {JSON.stringify(error)}</div>;
  if (!data) return <div>loading...</div>;
  const starWarsDataWithRandomImage = data.map((data) => {
    const randomImageIndex = Math.floor(Math.random() * 15) + 1;
    const randomImageSource = `http://localhost:3000/images/planet-${randomImageIndex}.jpg`;
    return { ...data, fields: { ...data.fields, imageSrc: randomImageSource } };
  });
  return (
    <div>
      <GlobalStyle />
      <StyledHeader>
        <StyledStarWarsLogo src={logo} alt='star-wars-logo' />
      </StyledHeader>
      <main>
        <StyledApp>
          <HorizontalList data={starWarsDataWithRandomImage}></HorizontalList>
        </StyledApp>
      </main>
    </div>
  );
}

export default App;
