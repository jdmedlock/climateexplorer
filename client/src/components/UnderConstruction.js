import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = {
  root: {
    backgroundColor: "#282c34",
    flexGrow: 1,
  },
  card: {
    minWidth: "50%",
    marginTop: "5rem",
  },
  grow: {
    flexGrow: 1,
  },
  title: {
    fontSize: "3rem",
  },
  subtitle: {
    fontSize: "1.5rem",
  }
};

const UnderConstruction = (props) => {
  return (
    <Paper className={props.classes.root}>
    <Card className={props.classes.card}>
      <CardContent>
        <Typography className={props.classes.title} color="textSecondary" gutterBottom>
          Under Construction!
        </Typography>
      </CardContent>
    </Card>
  </Paper>
  );
};

UnderConstruction.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string,
  href: PropTypes.string,
};

export default withStyles(styles)(UnderConstruction);