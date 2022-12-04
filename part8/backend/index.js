require('dotenv').config()
const { gql } = require('apollo-server')
const { ApolloServer } = require('apollo-server-express')
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const express = require('express')
const http = require('http')
const jwt = require('jsonwebtoken')
const { execute, subscribe } = require('graphql')
const { SubscriptionServer } = require('graphql-ws')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const book = require('./models/book')

const mongourl = process.env.MONGODB_URI
const JWT_SECRET = process.env.SECRET

mongoose.connect(mongourl)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = gql`
  type User {
    username: String!
    favoriteGenre: String
    id: ID!
  }

  type Token {
    value: String!
  }

  type Author {
    name: String
    id: ID!
    born: Int
    bookCount: Int
  }

  type Book {
    title: String!
    published: Int!
    author: Author
    genres: [String]
    id: ID!
  }
  
  type Query {
    bookCount: Int!
    authorCount: Int! 
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int
      genres: [String]
    ): Book!
    editAuthor(
      name: String
      setBornTo: Int
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }

  type Subscription {
    bookAdded: Book!
  } 
`

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre) {
        const books = await Book.find({}).populate('author')
        return books
      }
      else if (args.author && args.genre) {
        return await Book.find({ author: args.author , genres: { $in: [args.genre]}})
      }
      else if (args.author) {
        return await Book.find({ author: args.author })
      }
      else{
        return await Book.find({genres: { $in: [args.genre]}}).populate('author')
      }
    },
    allAuthors: async () => Author.find({}),
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Author: {
    bookCount: async (root) => {
      const books = await Book.find({}).populate('author')
      return books.filter(book => book.author === root.name).length
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const author = await Author.findOne({ name: args.author})
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      if (!author) {
        const newauthor = new Author({ name: args.author})
        try {
          await newauthor.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }
        return newauthor.save()
      }

      const book = new Book({ ...args, author: author })

      try {
        await book.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      pubsub.publish('BOOK_ADDED', { bookAdded: book})
      return book
    },
    editAuthor: async (root, args, context) => {
      const author = await Author.findOne({ name: args.name })
      currentUser = context.currentUser

      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      author.born = args.setBornTo
      try {
        await author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return author.save()
    },
    createUser: async (root, args) => {
      const user = new User({ ...args})

      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'salainen') {
        throw new UserInputError('wrong credentials')
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    },
  },
}

const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const schema = makeExecutableSchema({ typeDefs, resolvers })

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })
  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null
      if (auth && auth.toLowerCase().startsWith('bearer ')) {
        const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET)
        const currentUser = await User.findById(decodedToken.id)
        return { currentUser }
      }
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose()
          },
        }
      },
    }
  ],
  })

  await server.start()

  server.applyMiddleware({
    app,
    path: '/',
  })

  const PORT = 4000

  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  )
}

start()