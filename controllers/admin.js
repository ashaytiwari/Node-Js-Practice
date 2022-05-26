const Product = require('../models/product');

exports.getAddProducts = (request, response, next) => {

  response.render('admin/add-product', {
    title: 'Add Product',
    path: '/admin/add-product'
  });

};

exports.postAddProducts = (request, response, next) => {

  const title = request.body.title;
  const imageURL = request.body.imageURL;
  const price = request.body.price;
  const description = request.body.description;

  const product = new Product(title, imageURL, price, description);

  product.save();

  response.redirect('/');

}

exports.getProducts = (request, response, next) => {

  Product.getAllProducts((products) => {

    response.render('admin/products', {
      title: 'Admin Products',
      products,
      path: '/admin/products'
    });

  });

}