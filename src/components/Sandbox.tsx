import Counter from "./Counter";
import "./Sandbox.css";

export default function Sandbox() {
  return (
    <div className="sandbox">
      <h1>Adi's Sandbox</h1>
      <div className="card">
        <p>This is a FE dev sandbox with Vite + React + TS.</p>
        <p>Try the counter below:</p>
        <Counter />
      </div>
    </div>
  );
}
