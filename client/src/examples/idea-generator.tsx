// inside your React component
import axios from "axios";
import { useState } from "react";

function IdeaGenerator() {
  const [topic, setTopic] = useState("");
  const [idea, setIdea] = useState("");

  const getIdea = async () => {
    const res = await axios.post("http://localhost:5000/generate", { topic });
    setIdea(res.data.idea);
  };

  return (
    <div>
      <input
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter topic"
      />
      <button onClick={getIdea}>Generate</button>
      <p>{idea}</p>
    </div>
  );
}

export default IdeaGenerator;
