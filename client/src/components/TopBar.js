import React from 'react';
import PropTypes from 'prop-types';

import { Query } from 'react-apollo';
import { IS_LOGGED_IN } from '../graphql/queries';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import CEButton from './CEButton';

const styles = {
  root: {
    flexGrow: 1,
    fontWeight: 800,
  },
  grow: {
    flexGrow: 1,
  },
};

const TopBar = (props) => {
  const { classes, title, loginClickHandler } = props;
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h4" color="inherit" className={classes.grow}>
          {title}
        </Typography>
        <Query query={ IS_LOGGED_IN }>
          {({ data, loading, error }) => {
            const buttonTitle = (data.isLoggedIn ? "Logoff" : "Login");
            return (<CEButton name={ buttonTitle } clickHandler={ loginClickHandler } />);
          }}
        </Query>
      </Toolbar>
    </AppBar>
  );
}

TopBar.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  loginClickHandler: PropTypes.func.isRequired,
};

export default withStyles(styles)(TopBar);