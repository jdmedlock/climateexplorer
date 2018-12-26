import gql from "graphql-tag";

const me = async (client) => {
  let meIsRetrieved = new Promise((resolve, reject) => {
    client.query({
      query: gql`
        query {
          me {
            id
            name
          }
        }`
    })
    .then(result => {
      console.log(`id: ${result.data.me.id} name:${result.data.me.name}`);
      resolve(result);
    });
  });

  let result = await meIsRetrieved;
  return result;
};

export { me };