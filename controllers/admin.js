const mongodb = require('mongodb');
const { validationResult } = require('express-validator');

const Product = require('../models/product');

exports.getAddProducts = (request, response, next) => {

  response.render('admin/edit-product', {
    title: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    product: null,
    errorMessage: null
  });

};

exports.postAddProducts = (request, response, next) => {

  const body = request.body;

  const image = request.file;

  if (typeof image === 'undefined') {
    return response.status(422).render('admin/edit-product', {
      title: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      product: null,
      errorMessage: 'Only png, jpg and jpeg file is allowed'
    });
  }

  const imageURL = image.path;

  const productData = {
    title: body.title,
    imageURL: imageURL,
    price: body.price,
    description: body.description,
    userId: request.user._id
  };

  const errors = validationResult(request);

  if (errors.isEmpty() === false) {

    return response.status(422).render('admin/edit-product', {
      title: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      product: null,
      errorMessage: errors.array()[0].msg
    });

  }

  const product = new Product(productData);

  product
    .save()
    .then((result) => {
      response.redirect('/admin/products');
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
        product,
        errorMessage: null
      });

    })
    .catch((error) => {
      console.log(error);
    });

};

exports.postEditProducts = (request, response, next) => {

  const id = request.body.productId;
  const title = request.body.title;
  const image = request.file;
  const price = request.body.price;
  const description = request.body.description;

  Product.findById(id)
    .then((product) => {

      product.title = title;
      product.price = price;
      product.description = description;

      if (image) {
        product.imageURL = image.path;
      }

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

  const page = +request.query.page || 1;
  const PAGE_LIMIT = 3;
  let totalItems;

  Product.find({ userId: request.user._id })
    .countDocuments()
    .then((numberOfProducts) => {

      totalItems = numberOfProducts;

      return Product.find()
        .skip((page - 1) * PAGE_LIMIT)
        .limit(PAGE_LIMIT);

    })
    .then((products) => {

      response.render('admin/products', {
        title: 'Admin Products',
        products,
        path: '/admin/products',
        currentPage: page,
        hasNextPage: PAGE_LIMIT * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / PAGE_LIMIT)
      });

    })
    .catch((error) => {
      console.log(error);
    });

}