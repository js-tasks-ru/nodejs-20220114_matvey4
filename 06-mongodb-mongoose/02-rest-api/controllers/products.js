const Product = require('../models/Product');
const mapProduct = require('../mappers/product');
const mongoose = require('mongoose');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;
  if (!subcategory) return next();

  const products = await Product.find({subcategory: subcategory});

  ctx.body = {products: products.map(product => mapProduct(product))};
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find();
  ctx.body = {products: products.map(product => mapProduct(product))};
};

module.exports.productById = async function productById(ctx, next) {
  const objectId = ctx.params.id
  if (!mongoose.Types.ObjectId.isValid(objectId))
  {
    ctx.status = 400;
    ctx.body = 'Invalid ObjectID';
    return next();
  }

  const product = await Product.findById(objectId);
  if (!product){
    ctx.status = 404;
    ctx.body = 'Product Not Found';
    return next();
  }

  ctx.body = {product: mapProduct(product)};

};

