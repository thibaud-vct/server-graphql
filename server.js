const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema, getIntrospectionQuery, GraphQLError } = require("graphql");

// Schema
// const schema = buildSchema(`
//   type Query {
//     hello : String,
//   }
// `);
const user_model = buildSchema(`
  type User {
      name: String,
      id: String,
      mail: String,
      token: String,
  }

  type Query {
    user(id: String): User
  }
`);

//Database
const users = {
    user: {
        name: "David",
        id: "1",
        mail: "david@me.com",
        token: "10",
    },
};

// Function
const root = { hello: () => "Hello world!" };
const getUser = {
    user: (id) => {
        console.log(id);
        return users[id];
    },
};

/**
 * When called, this is provided an argument which you can use to get information about the GraphQL request:
 * { document, variables, operationName, result, context }
 *
 * This example illustrates adding the amount of time consumed by running the provided query, which could perhaps be used by your development tools.
 */
const extensions = ({
    document,
    variables,
    operationName,
    result,
    context,
}) => {
    return {
        runTime: Date.now() - context.startTime,
    };
};

// APP
var app = express();

app.use(
    "/graphql",
    graphqlHTTP({
        schema: user_model,
        rootValue: root,
        graphiql: true,
    })
);

app.use(
    "/user",
    graphqlHTTP(async (req, res, graphQLParams) => ({
        schema: user_model,
        rootValue: await getUser(req),
        context: { startTime: Date.now() },
        graphiql: true,
        pretty: true,
        extensions,
    }))
);

app.listen(4000, () => console.log("Now browse to localhost:4000/graphql"));
