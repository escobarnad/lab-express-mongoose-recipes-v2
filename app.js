const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const Recipe = require("./models/Recipe.model");
const app = express();

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
app.post('/recipes', async (req, res) => {

    try {
        const newRecipe = await Recipe.create(req.body)
        res.status(201).json({ recipe: newRecipe });
    } catch (error) {
        res.status(500).json({ error })
    }

});

//  Iteration 4 - Get All Recipes
//  GET  /recipes route

app.get('/recipes', (req, res) => {
   Recipe.find({})
    .then((recipes) => {
        res.status(201).json(recipes)
    }) .catch ((error) => {
        res.status(500).json({message: "Error while getting all recipes"})
    })
});

//  Iteration 5 - Get a Single Recipe
//  GET  /recipes/:id route

app.get('/recipes/:recipeId', async (request, response) => {
    const { recipeId } = request.params
    if (mongoose.isValidObjectId(recipeId)) {
      try {
        const currentRecipe = await Recipe.findById(recipeId)
        if (currentRecipe) {
        response.json({ recipe: currentRecipe })
         } else {
        response.status(404).json({ message: 'Recipe not found' })
        }
      } catch (error) {
        console.log(error)
        response.status(500).json({ error })
      }
    } else {
        response.status(400).json({ message: 'The id seems wrong' })
      }
  })


//  Iteration 6 - Update a Single Recipe
//  PUT  /recipes/:id route
app.put('/recipes/:recipeId', async (request, response) => {
    const { recipeId } = request.params
  
    try {
      const newRecipe = await Recipe.findByIdAndUpdate(recipeId, request.body, { new: true })
      response.status(202).json({ recipe: newRecipe })
    } catch (error) {
      console.log(error)
      response.status(400).json({ error })
    }
  })

//  Iteration 7 - Delete a Single Recipe
//  DELETE  /recipes/:id route

app.delete('/recipes/:recipeId', async (request, response) => {
    const { recipeId } = request.params
  
    await Recipe.findByIdAndDelete(recipeId)
    response.status(202).json({ message: 'Recipe deleted' })
  })

// BONUS
//  Bonus: Iteration 9 - Create a Single User
//  POST  /users route


//  Bonus: Iteration 10 | Get a Single User
//  GET /users/:id route


//  Bonus: Iteration 11 | Update a Single User
//  GET /users/:id route


// Start the server
app.listen(3000, () => console.log('My first app listening on port 3000!'));



//❗️DO NOT REMOVE THE BELOW CODE
module.exports = app;