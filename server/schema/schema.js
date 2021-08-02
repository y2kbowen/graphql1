const graphql = require("graphql");
var _ = require("lodash");

const User  = require('../model/user')
const Post = require('../model/post')
const Hobby = require('../model/hobby')


const { buildResolveInfo } = require("graphql/execution/execute");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

// var users = [
//   { id: "1", name: "Bond", age: 36, profession: "spy" },
//   { id: "13", name: "Anna", age: 26 },
//   { id: "211", name: "Bella", age: 16 },
//   { id: "19", name: "Gina", age: 26 },
//   { id: "150", name: "Georgina", age: 56 },
//   { id: "200", name: "George", age: 56, profession: "Developer" },
//   { id: "201", name: "Ken", age: 57, profession: "Code Wrangler" },
// ];

// var posts = [
//   { id: "1", comment: "1s first comment", userId: "1" },
//   { id: "2", comment: "1s second comment", userId: "1" },
//   { id: "3", comment: "13s first comment", userId: "13" },
//   { id: "4", comment: "19s first comment", userId: "19" },
// ];

// var hobbies = [
//   {
//     id: "1",
//     title: "programming",
//     description: "Using computers to make the world a better place",
//     userId: "201",
//   },
//   {
//     id: "2",
//     title: "rowing",
//     description: "Sweat and fell better before eating donuts",
//     userId: 200,
//   },
//   {
//     id: "3",
//     title: "Swimming",
//     description: "Get in the water and learn to like hurting",
//     userId: 19,
//   },
//   {
//     id: "4",
//     title: "Bowling",
//     description: "Play a frustrating game while drinking beer",
//     userId: 201,
//   },
//   {
//     id: "5",
//     title: "boating",
//     description: "Spend money on something you can use 3 months per year",
//     userId: 201,
//   },
//   {
//     id: "7",
//     title: "women",
//     description: "Spend quality time with women",
//     userId: "1",
//   },
// ];

const UserType = new graphql.GraphQLObjectType({
  name: "User",
  description: "Documentaion for user....",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    profession: { type: GraphQLString },
    posts: {
      type: new graphql.GraphQLList(PostType),
      resolve(parent, args) {
        //return _.filter(posts, { userId: parent.id });
        return Post.find({userId:parent.id})
      },
    },
    hobbies: {
      type: new graphql.GraphQLList(HobbyType),
      resolve(parent, args) {
        //return _.filter(hobbies, { userId: parent.id });
        return Hobby.find({userId:parent.id})
      },
    },
  }),
});

const HobbyType = new GraphQLObjectType({
  name: "Hobby",
  description: "Hobby description",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        //return _.find(users, { id: parent.userId });
        return User.findById(parent.userId)
      },
    },
  }),
});

const PostType = new GraphQLObjectType({
  name: "Post",
  description: "Post description",
  fields: () => ({
    id: { type: GraphQLID },
    comment: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        //return _.find(users, { id: parent.userId });
        return User.findById(parent.userId)
      },
    },
  }),
});

// RootQuery
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  description: "Description",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },

      resolve(parent, args) {
        //return _.find(users, { id: args.id });
        return User.findById(args.id);
      },
    },
    users: {
      type: new GraphQLList(UserType),

      resolve(parent, args) {

        //return users;
        return User.find({});

      },
    },
    hobby: {
      type: HobbyType,
      args: { id: { type: GraphQLString } },

      resolve(parent, args) {
        //return _.find(hobbies, { id: args.id });
        return Hobby.findById(args.id);
      },
    },
    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        //return hobbies;
        return Hobby.find({});
      },
    },
    post: {
      type: PostType,
      args: { id: { type: GraphQLString } },

      resolve(parent, args) {
        //return _.find(posts, { id: args.id });
        return Post.findById(args.id);
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        //return posts;
        return Post.find({});
      },
    },
  },
});

// Mutations
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    CreateUser: {
      type: UserType,
      args: {
        name: { type:new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        profession: { type: GraphQLString },
      },

      resolve(parent, args) {
        let newUser = new User( {
          name: args.name,
          age: args.age,
          profession: args.profession,
        });

        // save to mongo db
        newUser.save();

        return newUser;

      },
    },
    CreatePost: {
      type: PostType,
      args: {
        // id: {type: GraphQLID},
        comment: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },

      resolve(parent, args) {
        let newPost = new Post( {
          comment: args.comment,
          userId: args.userId,
        });

        newPost.save();

        return newPost;
      },
    },
    CreateHobby: {
      type: HobbyType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },

      resolve(parent, args) {
        let newHobby = new Hobby({
          title: args.title,
          description: args.description,
          userId: args.userId,
        });

        newHobby.save();

        return newHobby;
      },
    },
  },
});

module.exports = new graphql.GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
