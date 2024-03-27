const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const app = express();

const Recipe = require("./models/Recipe.model")

// MIDDLEWARE
app.use(logger("dev"));
app.use(express.static("public"));
app.use(express.json());


// Iteration 1 - Connect to MongoDB
// DATABASE CONNECTION

const MONGODB_URI = "mongodb://127.0.0.1:27017/express-mongoose-recipes-dev";

mongoose
  .connect(MONGODB_URI)
  .then((x) => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to mongo", err));


// ROUTES
//  GET  / route - This is just an example route
app.get('/', (req, res) => {
    res.send("<h1>LAB | Express Mongoose Recipes</h1>");
});


//  Iteration 3 - Create a Recipe route
//  POST  /recipes route
app.post("/recipes", (req, res) => {
  Recipe.create(req.body)
  .then((createdRecipe) => {
    console.log("Recipe created ->", createdRecipe)
    res.status(201).json(createdRecipe)
  })
  .catch((error) =>
  {console.error("Error while trying to create the recipes ->", error)
  res.status(500).send({ error: "Failed to create the recipes"})})
})

//  Iteration 4 - Get All Recipes
//  GET  /recipes route

app.get("/recipes", (req, res) => {
  Recipe.find({})
  .then ((recipes) => {
    console.log("Retrieved recipes ->", recipes)
    res.status(200).json(recipes)
  })
  .catch((error) => {
    console.error(error)
    res.status(500).send({ error: "Failed to retrieve recipes"})
  })
})

//  Iteration 5 - Get a Single Recipe
//  GET  /recipes/:id route
app.get('/recipes/:recipeId', async (req, res) => {
  const { recipeId } = req.params
  if (mongoose.isValidObjectId(recipeId)) {
    try {
      const currentRecipe = await Recipe.findById(recipeId)
      if (currentRecipe) {
        res.json({ recipe: currentRecipe })
      } else {
        res.status(404).json({ message: 'Recipe not found' })
      }
    } catch (error) {
      console.log(error)
      res.status(400).json({ error })
    }
  } else {
    res.status(400).json({ message: 'The id seems wrong' })
  }
})

//  Iteration 6 - Update a Single Recipe
//  PUT  /recipes/:id route

app.put('/recipes/:recipeId', async (req, res) => {
  const { recipeId } = req.params

  console.log(recipeId)

  try {
    const updateRecipe = await Recipe.findByIdAndUpdate(recipeId, req.body, { new: true })
    res.status(202).json({ cohort: updateRecipe })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error })
  }
})

//  Iteration 7 - Delete a Single Recipe
//  DELETE  /recipes/:id route

app.delete('/recipes/:recipeId', async (req, res) => {
  const { recipeId } = req.params

  await Recipe.findByIdAndDelete(recipeId)
  res.status(202).json({ message: 'Recipe deleted' })
})


// Start the server
app.listen(3000, () => console.log('My first app listening on port 3000!'));



//❗️DO NOT REMOVE THE BELOW CODE
module.exports = app;