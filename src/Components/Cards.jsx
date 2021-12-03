import React from "react";
import { useEffect, useState } from "react";
import SingleCard from "./SingleCard";
import "./SingleCard.css";
import "./Cards.css";

const Cards = () => {
  const [deck, setDeck] = useState();
  const [allCards, setAllCards] = useState([]);
  const [playCards, setPlayCards] = useState([]);
  const [cardOne, setCardOne] = useState(null);
  const [cardTwo, setCardTwo] = useState(null);
  const [turns, setTurns] = useState(0);
  const [disabled, setDisabled] = useState(false);

  // hämtar 1 deck och setter den i variabel deck med hjälp av setDeck, körs bara 1 gång eftersom vi använder en tom array
  useEffect(() => {
    async function getDeck() {
      const res = await fetch(
        "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
      );
      const data = await res.json();
      setDeck(data);
    }
    getDeck();
  }, []);

  // drar korten från decket och setter dem i en array [allCards]
  useEffect(() => {
    if (deck) {
      async function getCards() {
        const res = await fetch(
          `https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=12`
        );
        const data = await res.json();
        setAllCards(data.cards);
      }
      getCards();
    }
  }, [deck]);

  // jämför 2 valda kort
  useEffect(() => {
    if (cardOne && cardTwo) {
      setDisabled(true);
      if (cardOne.code === cardTwo.code) {
        setPlayCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.code === cardOne.code) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        console.log("Those cards match");
        resetTurn();
      } else {
        console.log("Those cards dont match");
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [cardOne, cardTwo]);

  // gör en ny array som sedan används i spelet (duplicerar kort), sorterar dem slumpmässigt samt adderar en till key-value pair (matched)
  function shuffleCards() {
    const shuffledCards = [...allCards, ...allCards]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, matched: false }));
    setPlayCards(shuffledCards);
    setTurns(0);
  }

  // om 1a kortet är redan vald, sätt värde av det aktuella kortet till 2a kortet, annars till det 1a
  function handleCards(card) {
    cardOne ? setCardTwo(card) : setCardOne(card);
  }

  // efter en turn sätter vi värde av 2 valda kort till null igen, samt räknar turns med +1
  function resetTurn() {
    setCardOne(null);
    setCardTwo(null);
    setTurns((prevTurns) => prevTurns + 1);
    setDisabled(false);
  }

  return (
    <div className="container">
      <div>
        <button onClick={shuffleCards}>New Game</button>
        <p>Turns: {turns} </p>
      </div>
      <div className="card-grid">
        {playCards.map((item, index) => (
          <SingleCard
            key={index}
            card={item}
            handleCards={handleCards}
            flipped={item === cardOne || item === cardTwo || item.matched}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
};

export default Cards;
