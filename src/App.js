import React, { Component } from 'react';
import {BrowserRouter, Route, Link} from 'react-router-dom';
import signUp from './pages/signUp';
import addasset from './pages/addAssets'
class App extends Component {
  render() {
    return (
      <BrowserRouter>
      <div>
        
      <div>
      <Route path='/signUp' exact component={signUp}></Route>
      {/* <Route path='/Review' exact component={Review}></Route> */}
      <Route path='/' exact component={addasset}></Route>
      </div>
      </div>
      </BrowserRouter>
    );
  }
}

export default App;
