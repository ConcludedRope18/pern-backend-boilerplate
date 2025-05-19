require('dotenv').config(); 
const express = require('express');
const jwt = require('jsonwebtoken');
const eventRoutes = require('./routes/eventRoutes');
const myDataSource = require('./config/database');

const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const SECRET = process.env.JWT_SECRET;

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const auth = req.headers.authorization || "";
      let user = null;

      if (auth.startsWith("Bearer ")) {
        try {
          const token = auth.split(" ")[1];
          const decoded = jwt.verify(token, SECRET);
          user = { id: decoded.id };
        } catch (err) {
          console.error("Invalid JWT:", err.message);
        }
      }

      return { user };
    },
  });

  await server.start();
  server.applyMiddleware({ app });
  
  console.log(`Graphql server running at http://localhost:${port}${server.graphqlPath}`);
}


myDataSource
  .initialize()
  .then(async () => {
    await startApolloServer();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err)
  })

const app = express();
app.use(express.json());

const port = 3001;

app.use('/users', eventRoutes);
