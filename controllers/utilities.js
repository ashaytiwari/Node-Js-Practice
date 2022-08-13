exports.parseCartItemsData = (items) => {

  const products = [];

  if (items.length === 0) {
    return products;
  }

  for (let item of items) {

    const product = {
      _id: item.productId._id,
      title: item.productId.title,
      price: item.productId.price,
      description: item.productId.description,
      imageURL: item.productId.imageURL,
      userId: item.productId.userId,
      quantity: item.quantity
    };

    products.push(product);

  }

  return products;

};

exports.parseOrdersData = (items) => {

  const products = [];

  if (items.length === 0) {
    return products;
  }

  for (let item of items) {

    const data = {
      product: {
        _id: item.productId._id,
        title: item.productId.title,
        price: item.productId.price,
        description: item.productId.description,
        imageURL: item.productId.imageURL
      },
      quantity: item.quantity
    };

    products.push(data);

  }

  return products;
};