const express = require('express')
require("dotenv").config()

const errorHandler = require("./middleware/errorHandler")
const contactRoute = require("./routes/contactRoute")
const userRoute = require("./routes/userRoute")

const connectDb = require("./config/dbConnection")

const app = express()
app.use(express.json())

connectDb()

app.use('/api/contacts', contactRoute)
app.use('/api/users', userRoute)

app.use(errorHandler)

app.listen(process.env.PORT, () => console.log(`Server is Running on port ${process.env.PORT}!`))