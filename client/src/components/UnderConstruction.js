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
};

const UnderConstruction = (props) => {
  const { classes } = props;
  return (
    <Paper className={classes.root}>
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title} color="textSecondary" gutterBottom>
            Under Construction!
          </Typography>
        </CardContent>
      </Card>
    </Paper>
  );
}

UnderConstruction.propTypes = {
  title: PropTypes.string,
  href: PropTypes.string,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UnderConstruction);