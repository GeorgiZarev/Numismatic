import { useEffect } from "react";
import { useApiRequest } from "./hooks/useApiRequest";
import "./App.css";

function App() {
  const { getData, data, error, loading } = useApiRequest();

  useEffect(() => {
    getData("/coins");
  }, [getData]);

  return (
    <div>
      <h1>Coin List</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {data && (
        <ul>
          {data.map((coin) => (
            <li key={coin.id}>{coin.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
