import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import BottomNav from "./components/bottom_nav";
import AppBar from "./components/app_bar";
import HomePage from "./pages/home";
import RecordPage from "./pages/record";
import HistoryPage from "./pages/history";

import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <CssBaseline/>
        <AppBar/>
        <div style={{marginTop: "80px"}}>
        <Router>
          <Container maxWidth="sm">
          <Switch>
              <Route exact path="/" component={HomePage}/>
              <Route path="/record" component={RecordPage}/>
              <Route path="/history" component={HistoryPage}/>
          </Switch>
          </Container>
          <BottomNav/>
        </Router>
        </div>
      </div>
    );
  };
}

export default App;
