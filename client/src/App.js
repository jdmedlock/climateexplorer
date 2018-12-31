import React, { Component } from 'react';

import { Query } from 'react-apollo';
import { IS_LOGGED_IN } from './graphql/queries';

import './App.css';
import GlobalErrorBoundary from './components/GlobalErrorBoundary';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { createMuiTheme } from '@material-ui/core/styles';
import TopBar from './components/TopBar';
import Login from './components/Login';
import UnderConstruction from './components/UnderConstruction';
import BottomBar from './components/BottomBar';

  
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      getLoginEmail: false,
    };
  }

  loginClickHandler = () => {
    this.setState({ getLoginEmail: true });
  }

  setLoginEmail = (loginEmail) => {
    this.setState({
      getLoginEmail: false,
    });
  }

  render = () => {
    const theme = createMuiTheme({
      typography: {
        useNextVariants: true
      }
    });

    return (
      <div className="App">
        <GlobalErrorBoundary>
          <MuiThemeProvider theme={ theme }>
            <header className="App-header">
              <TopBar title="Climate Explorer" loginClickHandler={ this.loginClickHandler } />
            </header>

            <section className="App-results">
              <Query query={ IS_LOGGED_IN }>
                {({ data, loading, error }) => {
                  return (data.isLoggedIn ? <UnderConstruction /> : <Login />);
                }}
              </Query>
            </section>

            <footer className="App-footer">
              <BottomBar title="Data courtesy U.S. National Oceanographic and Atmospheric Administration (NOAA)"
                href={ process.env.REACT_APP_NOAA_HOMEPAGE } />
            </footer>
          </MuiThemeProvider>
        </GlobalErrorBoundary>
      </div>
    );
  }
}

export default App;
