import React from 'react';
import PropTypes from 'prop-types';

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

class  TopBar extends React.Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    loginClickHandler: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      
    };
  }

  render = () => {
    const { classes, title, loginClickHandler } = this.props;
    return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h4" color="inherit" className={classes.grow}>
            {title}
          </Typography>
          <CEButton name="Login" clickHandler={ loginClickHandler } />
        </Toolbar>
      </AppBar>
    );
  }
};



export default withStyles(styles)(TopBar);