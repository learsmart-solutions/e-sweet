import jollofImg from "../assets/dish-jollof.png";
import friedImg from "../assets/dish-fried.png";
import yamImg from "../assets/dish-yam.png";
import suyaImg from "../assets/dish-suya.png";
import puffImg from "../assets/dish-puff.png";
import friesImg from "../assets/float-fries.png";

import smokyJollofImg from "../assets/menu/smoky-jollof.png";
import asunRiceImg from "../assets/menu/asun-rice.png";
import pastaStirFryImg from "../assets/menu/pasta-stir-fry.png";
import friedChickenImg from "../assets/menu/fried-chicken.png";
import poundedYamImg from "../assets/menu/pounded-yam.png";
import efoRiroImg from "../assets/menu/efo-riro.png";
import shawarmaImg from "../assets/menu/shawarma.png";
import asunPepperedGoatImg from "../assets/menu/asun-peppered-goat.png";
import friedTurkeyImg from "../assets/menu/fried-turkey.png";
import spicyMoiMoiImg from "../assets/menu/spicy-moi-moi.png";
import boiledEggsImg from "../assets/menu/boiled-eggs.png";
import dodoPepperDipImg from "../assets/menu/dodo-pepper-dip.png";
import chilledZoboImg from "../assets/menu/chilled-zobo.png";
import chapmanImg from "../assets/menu/chapman.png";
import juicesImg from "../assets/menu/juices.png";

// Landing-page favourites. Kept separate from the full menu because the
// landing rail intentionally shows a short, curated selection.
export const dishes = [
  {
    id: "jollof",
    name: "Smoky jollof & chicken",
    description: "Firewood party jollof with peppered chicken and dodo.",
    price: "3,500",
    image: jollofImg,
  },
  {
    id: "fried-rice",
    name: "Fried rice & turkey",
    description: "Veggie-loaded fried rice with a peppered turkey wing.",
    price: "4,200",
    image: friedImg,
  },
  {
    id: "pounded-yam",
    name: "Pounded yam & egusi",
    description: "Smooth pounded yam, egusi, assorted meat and stockfish.",
    price: "4,500",
    image: yamImg,
  },
  {
    id: "suya",
    name: "Beef suya",
    description: "Yaji-rubbed beef skewers with onions and tomatoes.",
    price: "2,500",
    image: suyaImg,
  },
  {
    id: "puff-puff",
    name: "Puff-puff",
    description: "Soft, golden dough balls fried to order. Six pieces.",
    price: "1,000",
    image: puffImg,
  },
];

export const menuItems = [
  {
    id: "smoky-jollof",
    name: "Smoky jollof",
    description: "Firewood party jollof with peppered chicken and dodo.",
    price: 3500,
    category: "Rice & Pasta",
    badge: "Bestseller",
    badgeTone: "red",
    image: smokyJollofImg,
  },
  {
    id: "asun-rice",
    name: "Asun rice",
    description: "Smoky, peppery grilled goat meat on savory rice. Pure Nigerian heat.",
    price: 4200,
    category: "Rice & Pasta",
    image: asunRiceImg,
  },
  {
    id: "pasta-stir-fry",
    name: "Pasta Stir-fry",
    description: "Wok-tossed pasta with crisp veggies in a savory, garlicky sauce.",
    price: 3800,
    category: "Rice & Pasta",
    badge: "Spicy",
    badgeTone: "red",
    image: pastaStirFryImg,
  },
  {
    id: "lss-chicken",
    name: "LSS Chicken",
    description: "Crispy, golden fried chicken with a juicy bite. Crunch you'll crave.",
    price: 4000,
    category: "Grills",
    image: friedChickenImg,
  },
  {
    id: "pounded-yam",
    name: "Pounded yam",
    description: "Soft, stretchy pounded yam, made for scooping up rich soup.",
    price: 4500,
    category: "Swallow & Soup",
    badge: "Chef's pick",
    badgeTone: "ink",
    image: poundedYamImg,
  },
  {
    id: "efo-riro",
    name: "Efo Riro",
    description: "Rich vegetable soup with peppers and assorted meats.",
    price: 3200,
    category: "Swallow & Soup",
    image: efoRiroImg,
  },
  {
    id: "shawarma",
    name: "Shawarma",
    description: "Juicy grilled meat, crisp veggies, and creamy sauce wrapped in warm, toasted bread.",
    price: 3000,
    category: "Grills",
    image: shawarmaImg,
  },
  {
    id: "french-fries",
    name: "French fries",
    description: "Crispy golden fries tossed in our house yaji spice.",
    price: 2500,
    category: "Sides",
    badge: "Spicy",
    badgeTone: "red",
    image: friesImg,
  },
  {
    id: "asun-peppered-goat",
    name: "Asun (peppered goat)",
    description: "Smoky goat meat tossed in fiery pepper sauce.",
    price: 3000,
    category: "Grills",
    image: asunPepperedGoatImg,
  },
  {
    id: "lss-fried-turkey",
    name: "LSS Fried turkey",
    description: "Gbego turkey with our house pepper glaze.",
    price: 3500,
    category: "Grills",
    image: friedTurkeyImg,
  },
  {
    id: "spicy-moi-moi",
    name: "Spicy Moi-moi",
    description: "Steamed bean pudding with a spicy kick, soft, rich and packed with pepper flavour.",
    price: 1000,
    category: "Sides",
    image: spicyMoiMoiImg,
  },
  {
    id: "boiled-eggs",
    name: "LSS Sliced hard boiled eggs",
    description: "Neatly sliced hard boiled eggs, soft and creamy.",
    price: 4500,
    category: "Sides",
    badge: "Share",
    badgeTone: "ink",
    image: boiledEggsImg,
  },
  {
    id: "dodo-pepper-dip",
    name: "Dodo & pepper dip",
    description: "Ripe fried plantain with a side of pepper dip.",
    price: 1200,
    category: "Sides",
    image: dodoPepperDipImg,
  },
  {
    id: "chilled-zobo",
    name: "Chilled zobo",
    description: "Hibiscus, ginger and pineapple, served ice cold.",
    price: 800,
    category: "Drinks",
    image: chilledZoboImg,
  },
  {
    id: "chapman",
    name: "Chapman",
    description: "The classic Nigerian party mocktail.",
    price: 1500,
    category: "Drinks",
    image: chapmanImg,
    imageBlend: "multiply",
  },
  {
    id: "fresh-juices",
    name: "Freshly chilled juices",
    description: "Fresh, chilled juice: Orange, Watermelon, or Grapes.",
    price: 700,
    category: "Drinks",
    image: juicesImg,
    imageBlend: "multiply",
  },
];
