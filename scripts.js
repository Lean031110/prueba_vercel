const products = [
  { name: 'Producto 1', description: 'Descripción del producto 1', price: '$10', id: 1, image: 'https://via.placeholder.com/150' },
  { name: 'Producto 2', description: 'Descripción del producto 2', price: '$20', id: 2, image: 'https://via.placeholder.com/150' },
  { name: 'Producto 3', description: 'Descripción del producto 3', price: '$30', id: 3, image: 'https://via.placeholder.com/150' },
];

function displayProducts(products) {
  const productList = document.getElementById('product-list');
  productList.innerHTML = '';
  products.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.className = 'product';
    productDiv.innerHTML = `
      <img src="${product.image}" alt="${product.name}" style="width:100%; border-radius:5px;">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p>${product.price}</p>
    `;
    productList.appendChild(productDiv);
  });
}

document.getElementById('search').addEventListener('input', function() {
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(this.value.toLowerCase())
  );
  displayProducts(filteredProducts);
});

// Initial display of products
displayProducts(products);