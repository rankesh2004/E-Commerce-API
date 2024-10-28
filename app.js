const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const { MongoClient, ObjectId } = require('mongodb');

const app = express()
app.use(express.json())
const url = "mongodb://127.0.0.1:27017/ecommerce"
const client = new MongoClient(url);
const database = client.db('ecommerce');

mongoose
    .connect(url)
    .then(()=>{
        console.log("Database Connect Successfully")
        app.listen(3000, () => {
            console.log("Server Running on http://localhost:3000");   
        })
    })
    .catch((error)=>console.log(error))

//Middleware
const authenticateUser = (req, res, next) => {
      let jwtToken
      const authUser = req.headers['authorization']
      if(authUser !== undefined){
          jwtToken = authUser.split(" ")[1]
      }
      if(jwtToken === undefined) {
          res.status(401).send("Invalid JWT Token!")
      } else {
          jwt.verify(jwtToken, "MY_SECRECT_KEY", (error, payload) => {
            if(error) {
              res.status(401).send("Invalid JWT Token!")
            } else {
              req.user = payload.userDetails
              next()
            }
          })
      }
}

//SignUp
app.post("/signup", async (req, res)=>{
  const {name, username, email, password} = req.body

  const collection = database.collection('users')
  const getUser = await collection.findOne({email})
  if(getUser !== null){
    res.status(400).send("User Already Exists!")
  } else {
    const hashedPassword = await bcrypt.hash(password, 10)
    await collection.insertOne({
        name,
        username,
        email,
        password: hashedPassword
    })
    res.status(200).send("User Successfully SignUp!")
  }
})

//SignIn
app.post("/signin", async(req, res) => {
  const {email, password} = req.body
  const collection = database.collection('users')
  const getUser = await collection.findOne({email})
  if(getUser !== null) {
    const isPassword = await bcrypt.compare(password, getUser.password)

    if(isPassword) {
      const userDetails = {user: getUser._id, email: getUser.email}
      
      const jwtToken = await jwt.sign({userDetails}, "MY_SECRECT_KEY")
      res.status(200).send({jwtToken, id: getUser._id})
    } else {
      res.status(400).send("Invalid Email and Password")
    }
  } else {
    res.status(400).send("Invalid Email and Password")
  }
})

//Profile View
app.put("/users/:id", authenticateUser, async (req, res)=>{
  try {
    const {id} = req.params
    const { name, username, email } = req.body;
    if (!req.user || !req.user.email) {
      return res.status(400).send({ error_msg: "User not authenticated." });
    }

    const collection = database.collection("users");
    
    await collection.updateOne(
      { _id:new ObjectId(id) },
      { $set: { "name": name, "username": username, "email": email } }
    );

    res.status(200).send({ success_msg: "Successfully updated!" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error_msg: "Details not successfully updated!" });
  }
})

//GET products API
app.get("/products", authenticateUser, async (req, res)=>{
  try {
    const { sortby, category, rating } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (rating) filter.rating = { $gte: rating }; 

    const sortOption = sortby ? { price: parseInt(sortby) } : {};
    const collection = database.collection('products');
    const products = await collection.find(filter).sort(sortOption).toArray();

    res.status(200).send(products);
  } catch (error) {
    res.status(400).send({ error_msg: "Products not found" });
    console.error(error);
  }
})

//GET Specific Product
app.get("/products/:id", authenticateUser, async (req, res)=>{
  try{
    const {id} = req.params
    console.log(req.user.user)
    const collection = database.collection('products')
    const getProducts = await collection.find({"id": parseInt(id)}).toArray()
    res.status(200).send(getProducts)
  } catch(error) {
    res.status(400).send({error_msg: "Product not found"})
    console.log(error)
  }
})  

//Add Cart API
app.post("/cart", authenticateUser, async(req, res)=>{
  try{
    const {title, brand, price, image_url, quantity} = req.body
    const collection = database.collection("cart")
    await collection.insertOne({user_id: req.user.user, title: title, brand: brand, price: price, image_url: image_url, quantity: quantity})
    res.status(200).send({success_msg: "Cart Successfully Added"})
  } catch {
    res.status(400).send({error_msg: "Not Cart Successfully Added"})
  }
})

//GET All Cart
app.get("/cart", authenticateUser, async (req, res)=>{
  try{
    const collection = database.collection("cart")
    const getCart = await collection.find({user_id: req.user.user}).toArray()
    res.status(200).send(getCart)
  } catch {
    res.status(400).send({error_msg: "Cart Empty"})
  }
})

//Edit Cart for Quantity
app.put("/cart", authenticateUser, async (req, res)=>{
  try{
    const {id, quantity} = req.body
    const collection = database.collection("cart")
    await collection.updateOne({_id:new ObjectId(id)},{$set:{quantity: quantity}})
    res.status(200).send({success_msg: "Cart Updated!"})
  } catch {
    res.status(400).send({error_msg: "Cart Not Updated!"})
  }
})

//DELETE Specific Cart
app.delete("/cart/:id", authenticateUser, async (req, res)=>{
  try{
    const {id} = req.params
    const collection = database.collection("cart")
    await collection.deleteOne({_id:new ObjectId(id)})
    res.status(200).send({success_msg: "Cart Item Deleted!"})
  } catch {
    res.status(400).send({error_msg: "Cart Item Not Deleted!"})
  }
})

//Add OrderApI
app.post("/orders", authenticateUser, async (req, res)=>{
  try{
    const {title, brand, price, image_url, quantity} = req.body
    const collection = database.collection("orders")
    await collection.insertOne({user_id: req.user.user, title: title, brand: brand, price: price, image_url: image_url, quantity: quantity})
    res.status(200).send({success_msg: "Order Successfully Added"})
  } catch {
    res.status(400).send({error_msg: "Not Order Successfully Added"})
  }
})

//Get All Order
app.get("/orders", authenticateUser, async (req, res)=>{
  try{
    const collection = database.collection("orders")
    const getOrder = await collection.find({user_id: req.user.user}).toArray()
    res.status(200).send(getOrder)
  } catch {
    res.status(400).send({error_msg: "Orders Empty"})
  }
})