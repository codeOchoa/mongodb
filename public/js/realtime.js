const socket = io();

const productList = document.getElementById('product-list');
const productForm = document.getElementById('product-form');

socket.on('updateProducts', (products) => {
    productList.innerHTML = "";
    products.forEach((product) => {
        const li = document.createElement('li');
        li.id = `product-${product.id}`;

        const productText = document.createTextNode(`${product.title} - ${product.price}`);
        
        const deleteButton = document.createElement('button');
        deleteButton.onclick = () => deleteProduct(product.id);
        
        const trashIcon = document.createElement('img');
        trashIcon.src = './trash-can-solid.svg';
        trashIcon.alt = 'Delete';
        trashIcon.classList.add('trash-icon');

        deleteButton.appendChild(trashIcon);
        li.appendChild(productText);
        li.appendChild(deleteButton);

        productList.appendChild(li);
    });
});

productForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const newProduct = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        code: document.getElementById('code').value,
        price: parseFloat(document.getElementById('price').value),
        stock: parseInt(document.getElementById('stock').value),
        category: document.getElementById('category').value,
        thumbnails: [],
        status: true,
    };

    socket.emit('newProduct', newProduct);
    productForm.reset();
});

function deleteProduct(productId) {
    socket.emit('deleteProduct', productId);
}
