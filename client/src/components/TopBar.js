import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import Button from './CEButton';
import Login from './Login';

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
    title: PropTypes.string,
    classes: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      
    };
  }

  render = () => {
    const { title, classes } = this.props;
    return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h4" color="inherit" className={classes.grow}>
            {title}
          </Typography>
          <Button name="Login" clickHandler={ null } />
        </Toolbar>
      </AppBar>
    );
  }
};



export default withStyles(styles)(TopBar);