import React from 'react';
import PropTypes from 'prop-types';

import { Query } from "react-apollo";
import gql from "graphql-tag";

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

const UnderConstruction = (props) => (
  <Query
    query={gql`
      {
        me {
          id
          name
        }
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      return (
        <Paper className={props.classes.root}>
        <Card className={props.classes.card}>
          <CardContent>
            <Typography className={props.classes.title} color="textSecondary" gutterBottom>
              Under Construction!
            </Typography>
            <Typography className={props.classes.subtitle} color="textSecondary" gutterBottom>
              Current user: {data.me.name}
            </Typography>
          </CardContent>
        </Card>
      </Paper>
      );
    }}
  </Query>
);

UnderConstruction.propTypes = {
  title: PropTypes.string,
  href: PropTypes.string,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UnderConstruction);