import React from 'react';
import styled from 'styled-components';
import { StarWarsPlanet } from '../types';

const StyledCard = styled.div`
  max-width: 240px;
  min-height: 700px;
  background: grey;
  border-radius: 5px;
  background-size: cover;
  background-position: center center;
  box-shadow: 0px 10px 30px -5px rgba(0, 0, 0, 0.3);
  transition: box-shadow 0.5s;
  will-change: transform;
  border: 15px solid white;
  color: rgba(74, 85, 104);
  background-color: white;

  &:hover {
    box-shadow: 0px 30px 100px -10px rgba(0, 0, 0, 0.4);
  }
`;

const StyledCardWrapper = styled.div`
  padding-left: 15px;
  padding-right: 15px;
`;

const StyledCardHeader = styled.h4`
  margin-bottom: 5px;
  font-size: 18px;
  font-weight: 700;
`;

const StyledCardTags = styled.div`
  padding-top: 10px;
  padding-bottom: 5px;
  padding-left: 15px;
  padding-right: 15px;
`;

const StyledCardTag = styled.div`
  padding-left: 7.5px;
  padding-right: 7.5px;
  padding-top: 2.5px;
  padding-bottom: 2.5px;
  margin-bottom: 5px;
  margin-right: 5px;
  font-size: 12px;
  display: inline-block;
  border-radius: 9999px;
  background-color: rgba(237, 242, 247);
  color: rgba(74, 85, 104);
`;

const StyledSubHeaderParagraph = styled.p`
  font-size: 12px;
  color: rgba(113, 128, 150);
`;

const StyledDescriptionList = styled.dl``;

const StyledDescriptionWrapper = styled.div`
  display: grid;
  padding-top: 8px;
  padding-bottom: 8px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
`;

const StyledDescriptionListTerm = styled.dt`
  color: rgba(107, 114, 128);
  line-height: 18px;
  font-size: 14px;
  font-weight: 500;
`;

const StyledDescriptionListDescription = styled.dd`
  grid-column: span 2 / span 2;
`;

const StyledCardImage = styled.img`
  object-fit: cover;
  width: 100%;
  height: 250px;
`;

const StarWarsPlanetCard = (props: StarWarsPlanet) => {
  const {
    name,
    diameter,
    rotation_period,
    orbital_period,
    gravity,
    population,
    climate,
    terrain,
    surface_water,
    created,
    edited,
    imageSrc,
  } = props;

  const createdFormattedDate = new Date(created).toLocaleDateString();
  const editedFormattedDate = new Date(edited).toLocaleDateString();

  return (
    <StyledCard>
      <StyledCardImage alt={`${name} planet`} src={imageSrc}></StyledCardImage>
      <StyledCardWrapper>
        <StyledSubHeaderParagraph>
          created: <b>{createdFormattedDate}</b>
        </StyledSubHeaderParagraph>
        <StyledSubHeaderParagraph>
          last edited: <b>{editedFormattedDate}</b>
        </StyledSubHeaderParagraph>
        <StyledCardHeader>{name}</StyledCardHeader>
        <StyledDescriptionList>
          <StyledDescriptionWrapper>
            <StyledDescriptionListTerm>Diameter</StyledDescriptionListTerm>
            <StyledDescriptionListDescription>{diameter}</StyledDescriptionListDescription>
          </StyledDescriptionWrapper>
          <StyledDescriptionWrapper>
            <StyledDescriptionListTerm>Rotation Period</StyledDescriptionListTerm>
            <StyledDescriptionListDescription>{rotation_period}</StyledDescriptionListDescription>
          </StyledDescriptionWrapper>
          <StyledDescriptionWrapper>
            <StyledDescriptionListTerm>Orbital Period</StyledDescriptionListTerm>
            <StyledDescriptionListDescription>{orbital_period}</StyledDescriptionListDescription>
          </StyledDescriptionWrapper>
          <StyledDescriptionWrapper>
            <StyledDescriptionListTerm>Gravity</StyledDescriptionListTerm>
            <StyledDescriptionListDescription>{gravity}</StyledDescriptionListDescription>
          </StyledDescriptionWrapper>
          <StyledDescriptionWrapper>
            <StyledDescriptionListTerm>Population</StyledDescriptionListTerm>
            <StyledDescriptionListDescription>{population}</StyledDescriptionListDescription>
          </StyledDescriptionWrapper>
        </StyledDescriptionList>
      </StyledCardWrapper>
      <StyledCardTags>
        <StyledCardTag>{climate}</StyledCardTag>
        <StyledCardTag>{terrain}</StyledCardTag>
        <StyledCardTag>{surface_water}</StyledCardTag>
      </StyledCardTags>
    </StyledCard>
  );
};

export default StarWarsPlanetCard;
