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

  const title = request.body.title;
  const imageURL = request.body.imageURL;
  const price = request.body.price;
  const description = request.body.description;

  const product = new Product(null, title, imageURL, price, description);

  product.save();

  response.redirect('/');

}

exports.getEditProducts = (request, response, next) => {

  const editMode = request.query.edit;

  if (!editMode) {
    return response.redirect('/');
  }

  const productId = request.params.productId;

  Product.findProductById(productId, (product) => {

    if (!product) {
      return response.redirect('/');
    }

    response.render('admin/edit-product', {
      title: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product
    });

  });


};

exports.postEditProducts = (request, response, next) => {

  const id = request.body.productId;
  const title = request.body.title;
  const imageURL = request.body.imageURL;
  const price = request.body.price;
  const description = request.body.description;

  const product = new Product(id, title, imageURL, price, description);

  product.save();

  response.redirect('/admin/products');

}

exports.deleteProduct = (request, response, next) => {

  const productId = request.body.productId;

  Product.deleteProductById(productId);

  response.redirect('/admin/products');


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