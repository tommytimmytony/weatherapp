import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Card.css";

export default function Card({ creatorData }) {
  const navigate = useNavigate();
  const [creator, setCreator] = useState(creatorData);

  return (
    <div className="card">
      <div
        onClick={() => navigate("/view", { state: { creatorData: creator } })}
      >
        <img src={`${creator.imageURL}`} alt={`${creator.name}'s image`} />
        <div>
          <h3>{creator.name}</h3>
          <a href={creator.url} target="_blank" rel="noopener noreferrer">
            {creator.url}
          </a>
          <p>{creator.description}</p>
        </div>
      </div>
      <div
        onClick={() => navigate("/edit", { state: { creatorData: creator } })}
      >
        <i className="fa-solid fa-pen-to-square fa-xl"></i>
      </div>
    </div>
  );
}
