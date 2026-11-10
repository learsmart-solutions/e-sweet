import jollofImg from "../assets/dish-jollof.png";
import friedImg from "../assets/dish-fried.png";
import yamImg from "../assets/dish-yam.png";
import suyaImg from "../assets/dish-suya.png";
import puffImg from "../assets/dish-puff.png";

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
