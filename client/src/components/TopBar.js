import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ApolloConsumer, Mutation, Query } from 'react-apollo';
import { IS_LOGGED_IN } from '../graphql/queries';
import { LOGOFF_USER } from '../graphql/mutations';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    flexGrow: 1,
    fontWeight: 800,
  },
  grow: {
    flexGrow: 1,
  },
  button: {
    backgroundColor: theme.palette.primary.light,
    fontWeight: 600,
    margin: theme.spacing.unit,
  },
});

class TopBar extends Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
  };

  clickHandler = (buttonRole, client) => {
    if (buttonRole === "Logoff") {
        client.writeData({ data: { isLoggedIn: false } });
        localStorage.clear();
    }
  }

  render = () => {
    const { classes, title } = this.props;
    return (
      <ApolloConsumer>
        {client => (
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h4" color="inherit" className={classes.grow}>
                {title}
              </Typography>
              <Query query={ IS_LOGGED_IN }>
                {({ data, loading, error }) => {
                  const buttonRole = (data.isLoggedIn ? "Logoff" : "Login");
                  return (
                    <Mutation mutation={ LOGOFF_USER } >
                      {mutationFunc => 
                        <Button variant="contained" className={ classes.button }
                          onClick={ () => this.clickHandler(buttonRole, client) } >
                          { buttonRole }
                        </Button>
                      }
                    </Mutation>
                  );
                }}
              </Query>
            </Toolbar>
          </AppBar>
        )}
      </ApolloConsumer>
    );
  }
}

export default withStyles(styles)(TopBar);