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
