export type StarWarsPlanet = {
  name: string;
  diameter: string;
  rotation_period: string;
  orbital_period: string;
  gravity: string;
  population: string;
  climate: string;
  terrain: string;
  surface_water: string;
  created: string;
  edited: string;
  imageSrc?: string;
};

export type StarWarsPlanets = [
  {
    fields: StarWarsPlanet;
    model: string;
    pk: string;
  }
];
