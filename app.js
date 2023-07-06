const express = require('express')
const app = express()
const dotenv = require('dotenv')

const connectDatabase = require('./config/database')
const errorMiddleware = require('./middlewares/errors')

//Setting up config.env file variables
dotenv.config({path : './config/config.env'})
app.use(express.json());

//Connecting to database
connectDatabase()

//Creating own middleware
// const middleware = (req,res,next)=>{
//     console.log('Hello From Middleware.')

//     //Setting up user variable globally
//     req.requestMethod = req.method
//     next();
// }
// app.use(middleware)

//Importing all routes
const jobs = require('./routes/jobs')

app.use('/api/v1',jobs)

//Middleware to handle errors
app.use(errorMiddleware)


const PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
})