import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import Home from "@/pages/Home";
import Whisper from "@/pages/Whisper";
import Demo from "@/pages/Demo";
import { trackPageView } from "@/lib/analytics";

function PageViewTracker() {
  const [location] = useLocation();
  useEffect(() => {
    trackPageView(location);
  }, [location]);
  return null;
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <PageViewTracker />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/demo" component={Demo} />
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
