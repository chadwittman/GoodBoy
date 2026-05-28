import { Switch, Route, Router as WouterRouter } from "wouter";
import Home from "@/pages/Home";
import Whisper from "@/pages/Whisper";

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/whisper" component={Whisper} />
        <Route>
          <div style={{ padding: 40, color: "#fff", textAlign: "center" }}>
            <h1>Not found</h1>
            <a href="/" style={{ color: "var(--ios-blue)" }}>Go home</a>
          </div>
        </Route>
      </Switch>
    </WouterRouter>
  );
}

export default App;
