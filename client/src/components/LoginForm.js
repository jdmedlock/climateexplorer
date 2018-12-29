import React, { Component } from 'react';
import PropTypes from 'prop-types';

import debounce from "lodash.debounce";
import isEmail from 'isemail';

import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

import CEButton from './CEButton';

const styles = theme => ({
  container: {
    backgroundColor: "white",
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: "2rem",
  },
  formControl: {
    margin: theme.spacing.unit,
  },
});

class LoginForm extends Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      emailAddress: '',
      emailErrorText: '',
    };

    this.emitChangeDebounce = debounce(this.saveEmailAddress, 75);
  }

  loginClickHandler = () => {
    let errorText = '';
    if (isEmail.validate(this.state.emailAddress)) {
      errorText = '';
      this.props.login({ variables: { email: this.state.emailAddress } });
    } else {
      errorText = 'Invalid email address entered';
    }
    this.setState({ emailErrorText: errorText });
  }

  emailChangeHandler = (event) => {
    // Add input entered by the user to the searchText element in
    // our state. Keystrokes are debounced to prevend the queryLocation function
    // from being called too many times in succession to reduce overhead.
    this.emitChangeDebounce(event.target.value);
  }

  saveEmailAddress = (enteredText) => {
    this.setState({ emailAddress: enteredText });
  }

  render = () => {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
          <FormControl className={ classes.formControl } error={ false }
            aria-describedby="input-email">
            <InputLabel htmlFor="input-email">Email address:</InputLabel>
            <Input id="input-email"
              autoFocus={ true } required={ true }
              placeholder="Enter your email address"
              variant="filled" 
              value={ this.state.email}
              onChange={ this.emailChangeHandler }
            />
            <FormHelperText id="input-email-error">{ this.state.emailErrorText}</FormHelperText>
            <CEButton name="Login" clickHandler={ this.loginClickHandler } />
          </FormControl>
      </div>
    );
  }
}

export default withStyles(styles)(LoginForm);
