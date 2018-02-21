import React from 'react';
import reactDom from 'react-dom';
import * as urlConstants from './section/constants/urlConstants';
import Home from './views/Home';
import Carpool from './views/Carpool';
import PageNotFound from './views/PageNotFound';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import {createLogger} from 'redux-logger';
import Reducers from './section/Reducers';
import * as constants from './section/constants/constants';

var ReactRouter = require('react-router-dom');
var Router = ReactRouter.BrowserRouter;
var Route = ReactRouter.Route;
var Switch = ReactRouter.Switch;

const logger = createLogger();
const store = createStore(
  Reducers,
  applyMiddleware(thunk, promise, logger)
);

class App extends React.Component {
  constructor(props){
    super(props);
    constants.updateLocalStorage();
  }

  render() {
    return (
      <div>
        <Provider store={store}>        
          <Router>
            <Switch>
              <Route exact path={urlConstants.urls.login.path} component={Home} />
              <Route exact path={urlConstants.urls.carpool.path} component={Carpool} />
              <Route path='*' component={PageNotFound} />
            </Switch>
          </Router>
        </Provider>
      </div>
    );
  }
}

reactDom.render(
  <App />, document.getElementById('root')
);