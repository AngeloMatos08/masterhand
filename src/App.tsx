import {useEffect} from "react";
import { getRPGs } from "./services/rpgService";

function App() {
  useEffect(() => {
    async function carregarRPGs() {
      const rpgs = await getRPGs();
      console.log(rpgs);
      console.log("Quantidade de RPGs:", rpgs.length);
    }
    carregarRPGs();
  }, []);
  return (
    <div className="App">
      <h1>RPGs</h1>
    </div>
  );
}

export default App;