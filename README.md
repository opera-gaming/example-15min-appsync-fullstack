# What dis?

This is a guide for how you quickly can set up a fullstack web application. In this guide
we'll build a simple text-messages application. We'll go through every step how how to set
up a frontend, api endpoint, a database and deploying it all to production in about 15
minutes (what?!).

You'll be on your own with creating your UI. But, there are a few useful components in `src/ui/`
that you can copy paste in to your project ;).

If you haven't used react before, make sure you try a plain react project before you follow this
guide!

[Tutorial: Intro to React](https://reactjs.org/tutorial/tutorial.html)

# Prerequisites

- Install node https://nodejs.org/en/download/
- Install yarn. If you prefer to use npm instead of yarn, I probably don't need to tell you how to
  modify this guide :).
  ```
  npm install --global yarn
  ```
- Set up an initial react project
  ```bash
  npx create-react-app@latest demo-15min-fullstack --template typescript
  ```
- Install amplify + some other tools we'll need
  ```bash
  yarn add aws-amplify aws-amplify-react uuid
  ```
- Install amplify CLI
  ```bash
  npm install -g @aws-amplify/cli
  ```

# Configure AWS

First, we'll need to configure our AWS account to set up the backend

1. In the root of your project, run
   ```bash
   amplify configure
   ```
1. Log in to your aws account (create one if you need to).
1. Go back to the terminal hit enter.
1. Select your region (I used eu-north-1 for Sweden).
1. Choose a username (I used amplify-fullstack-demo).
1. You'll be sent back to the browser. Leave everything as is and click next until your user is
   created.
1. On the last screen, you'll get your access credentials. Make sure you save these before you close
   the browser!
1. Go back to the terminal, hit enter, and enter your new credentials.
1. (optional) Set a profile name for your account.

# Initialize Amplify

1. Run
   ```bash
   amplify init
   ```
1. Leave all settings as is and hit enter.
1. Select the authentication method `AWS profile`.
1. Choose your profile (default if you didn't set one earlier).

Nice! You've created your initial backend! You can run `amplify status` to see information about it
(for now, it will be pretty empty).

# Create Graphql API

1. Run
   ```bash
   amplify add api
   ```
1. Choose GraphQL and blank schema. Leave everything else as default.
1. When asked if you want to edit your schema, say yes.
1. Add the following to your schema file:

   ```graphql
   enum MessageType {
     MESSAGE
   }

   type Message @model {
     id: ID!
     clientId: ID
     createdAt: AWSDateTime!
     type: MessageType!
       @index(
         name: "messagesByDate"
         queryField: "messagesByDate"
         sortKeyFields: ["createdAt"]
       )
     message: String!
     name: String!
   }
   ```

   This file can always be found in `amplify/backend/api/demo15minfullstack/schema.graphql`

1. Run `amplify mock api` to generate and start a local API server. I chose Typescript for
   programming language and kept everything else as default.
1. Run `amplify push` to create and deploy your dev server!
