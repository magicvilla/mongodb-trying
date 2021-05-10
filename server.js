import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8098
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/animals"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Animal = mongoose.model('Animal', {
  name: String,
  age: Number,
  isFurry: Boolean
})

// First delete everything in the database and THEN create this new ones
// Delete all of them and THEN we create these three
Animal.deleteMany().then(()=>{
  new Animal({ name: 'Bilbo', age: 7, isFurry: true }).save()
  new Animal({ name: 'Alfie', age: 1, isFurry: false }).save()
  new Animal({ name: 'Lykke', age: 3, isFurry: true }).save()
})

// Start defining your routes here
// find.() find all animals and return as json
app.get('/', (req, res) => {
  Animal.find().then(animals => {
    res.json(animals)
  })
})

// Pass in a param that we get from the request 
// THEN that animal we want to get back if there is an animal with that name
app.get('/:name', (req, res) => {
  Animal.findOne({ name: req.params.name }).then(animal => {
    if (animal) {
      res.json(animal)
    } else {
      res.status(404).json({ error: 'Not found' })
    }
  })
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
