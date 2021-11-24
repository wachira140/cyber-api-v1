require('dotenv').config()

const express =require('express')
const app = express()
const asyncErrors = require('express-async-errors')

// extra packages
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary').v2
const rateLimiter = require('express-rate-limit')
const helmet = require('helmet')
const xss = require('xss-clean')
const cors = require('cors')
const mongoSanitize = require('express-mongo-sanitize')


// database connection
const connectDB = require('./db/connect')

// routes

const productsRoute = require('./routes/products')
const userRoute = require('./routes/user')
const authRoute = require('./routes/auth')
const ordersRoute = require('./routes/orderRoutes')
const mpesaRoute = require('./routes/mpesaRoutes')
const paymentRoute = require('./routes/paymentRoute')



const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')



app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(cors());   


  app.use(xss());
app.use(mongoSanitize());


app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))


app.use(express.static('./public'));

cloudinary.config({
   cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.CLOUD_API_KEY,
  api_secret:process.env.CLOUD_API_SECRET,
})

app.use(fileUpload({useTempFiles:true}))

app.use('/api/v1/auth', authRoute)
app.use('/api/v1/products',productsRoute)
app.use('/api/v1/users', userRoute)
app.use('/api/v1/orders', ordersRoute)
app.use('/api/v1/mpesa', mpesaRoute)
app.use('/api/v1/payments', paymentRoute)


app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)


const port = process.env.PORT || 5000


// connect with db
const start = async ()=> {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port,console.log(`Server is listening on port ${port}...`))
  } catch (error) {
    console.log(error);
  }
}
start()