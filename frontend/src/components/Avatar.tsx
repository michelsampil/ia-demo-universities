// Avatar.tsx
import React from "react";
import styled from "styled-components";
import { colors } from "../styles/colors";

// Import all possible PNGs
import alligator from "../assets/avatars/alligator.png";
import anteater from "../assets/avatars/anteater.png";
import armadillo from "../assets/avatars/armadillo.png";
import auroch from "../assets/avatars/auroch.png";
import axolotl from "../assets/avatars/axolotl.png";
import badger from "../assets/avatars/badger.png";
import bat from "../assets/avatars/bat.png";
import beaver from "../assets/avatars/beaver.png";
import buffalo from "../assets/avatars/buffalo.png";
import camel from "../assets/avatars/camel.png";
import capybara from "../assets/avatars/capybara.png";
import chameleon from "../assets/avatars/chameleon.png";
import cheetah from "../assets/avatars/cheetah.png";
import chinchilla from "../assets/avatars/chinchilla.png";
import chipmunk from "../assets/avatars/chipmunk.png";
import chupacabra from "../assets/avatars/chupacabra.png";
import cormorant from "../assets/avatars/cormorant.png";
import coyote from "../assets/avatars/coyote.png";
import crow from "../assets/avatars/crow.png";
import dingo from "../assets/avatars/dingo.png";
import dinosaur from "../assets/avatars/dinosaur.png";
import dolphin from "../assets/avatars/dolphin.png";
import duck from "../assets/avatars/duck.png";
import elephant from "../assets/avatars/elephant.png";
import ferret from "../assets/avatars/ferret.png";
import fox from "../assets/avatars/fox.png";
import frog from "../assets/avatars/frog.png";
import giraffe from "../assets/avatars/giraffe.png";
import gopher from "../assets/avatars/gopher.png";
import grizzly from "../assets/avatars/grizzly.png";
import hedgehog from "../assets/avatars/hedgehog.png";
import hippo from "../assets/avatars/hippo.png";
import hyena from "../assets/avatars/hyena.png";
import ibex from "../assets/avatars/ibex.png";
import ifrit from "../assets/avatars/ifrit.png";
import iguana from "../assets/avatars/iguana.png";
import jackal from "../assets/avatars/jackal.png";
import kangaroo from "../assets/avatars/kangaroo.png";
import koala from "../assets/avatars/koala.png";
import kraken from "../assets/avatars/kraken.png";
import lemur from "../assets/avatars/lemur.png";
import leopard from "../assets/avatars/leopard.png";
import liger from "../assets/avatars/liger.png";
import llama from "../assets/avatars/llama.png";
import manatee from "../assets/avatars/manatee.png";
import mink from "../assets/avatars/mink.png";
import monkey from "../assets/avatars/monkey.png";
import moose from "../assets/avatars/moose.png";
import narwhal from "../assets/avatars/narwhal.png";
import orangutan from "../assets/avatars/orangutan.png";
import otter from "../assets/avatars/otter.png";
import panda from "../assets/avatars/panda.png";
import penguin from "../assets/avatars/penguin.png";
import platypus from "../assets/avatars/platypus.png";
import pumpkin from "../assets/avatars/pumpkin.png";
import python from "../assets/avatars/python.png";
import quagga from "../assets/avatars/quagga.png";
import rabbit from "../assets/avatars/rabbit.png";
import raccoon from "../assets/avatars/raccoon.png";
import rhino from "../assets/avatars/rhino.png";
import sheep from "../assets/avatars/sheep.png";
import shrew from "../assets/avatars/shrew.png";
import skunk from "../assets/avatars/skunk.png";
import squirrel from "../assets/avatars/squirrel.png";
import tiger from "../assets/avatars/tiger.png";
import turtle from "../assets/avatars/turtle.png";
import walrus from "../assets/avatars/walrus.png";
import wolf from "../assets/avatars/wolf.png";
import wolverine from "../assets/avatars/wolverine.png";
import wombat from "../assets/avatars/wombat.png";

// Map animal names to their corresponding PNG imports
const avatarMap: { [key: string]: string } = {
  alligator,
  anteater,
  armadillo,
  auroch,
  axolotl,
  badger,
  bat,
  beaver,
  buffalo,
  camel,
  capybara,
  chameleon,
  cheetah,
  chinchilla,
  chipmunk,
  chupacabra,
  cormorant,
  coyote,
  crow,
  dingo,
  dinosaur,
  dolphin,
  duck,
  elephant,
  ferret,
  fox,
  frog,
  giraffe,
  gopher,
  grizzly,
  hedgehog,
  hippo,
  hyena,
  ibex,
  ifrit,
  iguana,
  jackal,
  kangaroo,
  koala,
  kraken,
  lemur,
  leopard,
  liger,
  llama,
  manatee,
  mink,
  monkey,
  moose,
  narwhal,
  orangutan,
  otter,
  panda,
  penguin,
  platypus,
  pumpkin,
  python,
  quagga,
  rabbit,
  raccoon,
  rhino,
  sheep,
  shrew,
  skunk,
  squirrel,
  tiger,
  turtle,
  walrus,
  wolf,
  wolverine,
  wombat,
};

const animals = [
  "alligator",
  "anteater",
  "armadillo",
  "auroch",
  "axolotl",
  "badger",
  "bat",
  "beaver",
  "buffalo",
  "camel",
  "capybara",
  "chameleon",
  "cheetah",
  "chinchilla",
  "chipmunk",
  "chupacabra",
  "cormorant",
  "coyote",
  "crow",
  "dingo",
  "dinosaur",
  "dolphin",
  "duck",
  "elephant",
  "ferret",
  "fox",
  "frog",
  "giraffe",
  "gopher",
  "grizzly",
  "hedgehog",
  "hippo",
  "hyena",
  "ibex",
  "ifrit",
  "iguana",
  "jackal",
  "kangaroo",
  "koala",
  "kraken",
  "lemur",
  "leopard",
  "liger",
  "llama",
  "manatee",
  "mink",
  "monkey",
  "moose",
  "narwhal",
  "orangutan",
  "otter",
  "panda",
  "penguin",
  "platypus",
  "pumpkin",
  "python",
  "quagga",
  "rabbit",
  "raccoon",
  "rhino",
  "sheep",
  "shrew",
  "skunk",
  "squirrel",
  "tiger",
  "turtle",
  "walrus",
  "wolf",
  "wolverine",
  "wombat",
];

// List of colors
const colorList = [
  colors.coolGray,
  colors.gray,
  colors.darkGray,
  colors.graffito,
  colors.white,
  colors.offWhite,
  colors.lightTurquoise,
  colors.neonTurquoise,
  colors.washedBlue,
  colors.blackGray,
  colors.neonRed,
  colors.neonPink,
  colors.neonYellow,
  colors.tourqueeseStrong,
  colors.tourqueeseMid,
  colors.tourqueesePale,
  colors.tourqueeseBright,
  colors.deepBlue,
];

// Function to get a hash value from a string
const getHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

// Function to get a color and an animal based on a string
const getAnimalAndColor = (
  input: string
): { animal: string; color: string } => {
  const hash = Math.abs(getHash(input));
  const animal = animals[hash % animals.length];
  const color = colorList[hash % colorList.length];
  return { animal, color };
};

interface StyledAvatarProps {
  borderColor: string;
}

const StyledAvatar = styled.img<StyledAvatarProps>`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-right: 1rem;
  background: ${({ borderColor }) => borderColor};
  border: solid 5px black;
`;

interface AvatarProps {
  userName: string;
}

const Avatar: React.FC<AvatarProps> = ({ userName }) => {
  const { animal, color } = getAnimalAndColor(userName);
  const avatarSrc = avatarMap[animal] || "";

  return <StyledAvatar src={avatarSrc} alt={animal} borderColor={color} />;
};

export default Avatar;
