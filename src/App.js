import InvoiceList from "./InvoiceList";
import Navbar from "./Navbar";
import Upload from "./Upload";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Switch>
            <Route exact path="/">
              <Upload />
            </Route>
            <Route path="/invoice">
              <InvoiceList />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
