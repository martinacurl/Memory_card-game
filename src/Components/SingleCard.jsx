import React from "react";
import "./SingleCard.css";

const SingleCard = ({ card, handleCards, flipped, disabled }) => {
  function handleClick() {
    if (!disabled) {
      handleCards(card);
    }
  }

  return (
    <div className="card">
      <div className={flipped ? "flipped" : ""}>
        <img className="front" src={card.image} alt="card frontside" />
        <img
          className="back"
          src="./images/backside.jpg"
          alt="card backside"
          onClick={handleClick}
        />
      </div>
    </div>
  );
};

export default SingleCard;
