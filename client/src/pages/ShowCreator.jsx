import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Card.css";
import { supabase } from "../client.js";
import Card from "../components/Card.jsx";

export default function ShowCreators() {
  const [creators, setCreators] = useState([]);
  const navigate = useNavigate();

  async function fetchCreators() {
    const { data } = await supabase.from("creators").select();
    console.log(data);
    setCreators(data);
  }

  useEffect(() => {
    fetchCreators();
  }, []);

  return (
    <div className="cardContainer">
      {creators.length > 0 ? (
        creators.map((creator) => (
          <div>
            <Card key={creator.id} creatorData={creator} />
          </div>
        ))
      ) : (
        <h1>Data unavailable</h1>
      )}
    </div>
  );
}
