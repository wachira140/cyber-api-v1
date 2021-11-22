const Product = require('../model/Products')
const cloudinary = require('cloudinary').v2
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')





const createProduct = async (req, res)=>{

    const { name,brand,color,desc,price,category,featured,image,image_id, inStore, classification } = req.body
    if(!name || !brand|| !color|| !desc || !price || !category || !image || !image_id  || !classification ){
        throw new CustomError.BadRequestError('Please provide all values')
    }
  const product = await Product.create({ name,brand,color,desc,price,category,featured,image,image_id, inStore, classification })
  res.status(StatusCodes.CREATED).json({ product })
}



const getAllProducts = async (req,res)=>{
const {featured, category, brand, name, color} = req.query

const queryObject = {}

if(featured) {
queryObject.featured = featured === 'true' ? true: false
}

if(category){
    queryObject.category = category
}

if(name){
    // const namefield = name.join(',')
    queryObject.name = name
}

if(brand){
    queryObject.brand = brand
}
if(color){
    queryObject.color = color
}

let result = Product.find(queryObject)
  const products = await result
// console.log(products);
   res.status(StatusCodes.OK).json({ products, count:products.length})
}




const getSingleProduct = async (req, res) =>{

    const product = await Product.findOne({
      _id:req.params.id
    })


    if(!product){
       throw new CustomError.NotFoundError(`no product with id of: ${req.params.id}`)
    }

    res.status(StatusCodes.OK).json({product})
}

const updateProduct = async (req, res)=>{
    const product_id = req.params

    const { id:productId } = product_id
    
    const product = await Product.findByIdAndUpdate(
        {_id:productId, new: true},
        req.body 
        )

        if(!product){
            throw new CustomError.NotFoundError(`no product with id of: ${req.params.id}`)
        }

        // if(product.name === ''){
        //      throw new CustomError.BadRequestError('Please provide all values')
        // }
    
    res.status(StatusCodes.OK).json({product})
}

const deleteProduct = async (req, res) =>{
    const product_id = req.params

    const { id:productId } = product_id
    
    let product = await Product.findById({
        _id:productId
    })

    // error handling
    if(!product){
            throw new CustomError.NotFoundError(`no product with id of: ${req.params.id}`)
        }

     await cloudinary.uploader.destroy(product.image_id)

    await product.remove();

    res.status(StatusCodes.OK).send({msg:'product deleted successfully'})
}



module.exports ={
            getAllProducts,
            createProduct,
            getSingleProduct,
            updateProduct,
            deleteProduct,
        }
