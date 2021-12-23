const express = require('express');

const router= express.Router();

const authenticate= require("../middleweres/authenticate");
const authorise = require("../middleweres/authorise");
const Product= require('../models/product.model');

router.get("/", async (req, res) => {
    const products = await Product.find().populate({path: "user", select : "name"}).lean().exec();
  
    return res.send(products);
  });

router.post("/", authenticate,authorise(["admin","seller"]),async (req, res) => {
    try {
        const user= req.user;
        const product = await Product.create({
            name:req.body.name,
            price:req.body.price,
            user:user.user._id
        });
        res.status(201).send({product});
    } catch (err) {
        res.status(500).json({message: err.message,status: "Failed"});
    }
});


module.exports = router;