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

  const title = body.title;
  const imageURL = body.imageURL;
  const price = body.price;
  const description = body.description;
  const userId = request.user.id;

  Product.create({
    title,
    imageURL,
    description,
    price,
    userId
  })
    .then((result) => {
      console.log(result);
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

  Product.findByPk(productId)
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

  Product.findByPk(id)
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

  Product.findByPk(productId)
    .then((product) => {
      return product.destroy();
    })
    .then((result) => {
      response.redirect('/admin/products');
    })
    .catch((error) => console.log(error));

}

exports.getProducts = (request, response, next) => {

  Product.findAll()
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