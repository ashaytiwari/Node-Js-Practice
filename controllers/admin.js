const mongodb = require('mongodb');

const Product = require('../models/product');

exports.getAddProducts = (request, response, next) => {

  response.render('admin/edit-product', {
    title: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    product: null
  });

};

exports.postAddProducts = (request, response, next) => {

  const body = request.body;

  const productData = {
    title: body.title,
    imageURL: body.imageURL,
    price: body.price,
    description: body.description,
    userId: request.user._id
  };

  const product = new Product(productData);

  product
    .save()
    .then((result) => {
      response.redirect('/');
    }).catch((error) => {
      console.log(error)
    });

}

exports.getEditProducts = (request, response, next) => {

  const editMode = request.query.edit;

  if (!editMode) {
    return response.redirect('/');
  }

  const productId = request.params.productId;

  Product.findById(productId)
    .then((product) => {

      if (!product) {
        return response.redirect('/');
      }

      response.render('admin/edit-product', {
        title: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product
      });

    })
    .catch((error) => {
      console.log(error);
    });

};

exports.postEditProducts = (request, response, next) => {

  const id = request.body.productId;
  const title = request.body.title;
  const imageURL = request.body.imageURL;
  const price = request.body.price;
  const description = request.body.description;

  Product.findById(id)
    .then((product) => {

      product.title = title;
      product.imageURL = imageURL;
      product.price = price;
      product.description = description;

      return product.save();

    })
    .then((result) => {

      console.log('Updated Product');

      response.redirect('/admin/products');

    })
    .catch((error) => console.log(error));

}

exports.deleteProduct = (request, response, next) => {

  const productId = request.body.productId;

  Product.findByIdAndRemove(productId)
    .then((result) => {
      response.redirect('/admin/products');
    })
    .catch((error) => console.log(error));

}

exports.getProducts = (request, response, next) => {

  Product.find()
    .then((products) => {
      response.render('admin/products', {
        title: 'Admin Products',
        products,
        path: '/admin/products'
      });
    })
    .catch((error) => {
      console.log(error);
    });

}