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
      description: item.productId.price,
      imageURL: item.productId.imageURL,
      userId: item.productId.userId,
      quantity: item.quantity
    };

    products.push(product);

  }

  return products;

}