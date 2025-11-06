// produtos fixos (originais)
const produtosFixos = [
  { nome: "Mouse Gamer", preco: 129.90, imagem: "img/mouse.png" },
  { nome: "MousePad Colorido", preco: 29.90 , imagem: "img/mousepad.png"},
  { nome: "Microfone Gamer", preco: 499.90 , imagem: "img/microfone.png"},
  { nome: "Console Vídeo Game", preco: 3499.90 , imagem: "img/videogame.png"},
  { nome: "Tv Retro", preco: 1299.90 , imagem: "img/tvretro.png"},
  { nome: "Controle Vídeo Game", preco: 399.90 , imagem: "img/controlegamer.png"},
  { nome: "Pc Gamer", preco: 6099.90 , imagem: "img/pcgamer.png"},
  { nome: "Headset USB", preco: 149.90 , imagem: "img/fone.png"},
  { nome: "Monitor 144Hz", preco: 899.90 , imagem: "img/pcgamer.png"},
  { nome: "Notebook Escritório 6ram", preco: 2299.90 , imagem: "img/notebookescritório.png"}
];

let products = [];   // todos os produtos (fixos + cadastrados)
let cart = []; // Criação de uma variável chamada cart para colocar dentro dela uma lista.
let fixedLoaded = false; // flag para carregar fixos apenas 1 vez

// converte e carrega produtos fixos para 'products' (apenas uma vez)
function loadFixedProductsOnce() {
  if (fixedLoaded) return;
  const base = Date.now();
  produtosFixos.forEach((p, i) => {
    products.push({
      id: base + i,        // id único
      name: p.nome,
      price: p.preco,
      imagem: p.imagem
    });
  });
  fixedLoaded = true;
}

// Renderizar Produtos (desenha TODOS os produtos do array `products`)
function renderProducts() {
  const productList = document.getElementById('product-list');
  productList.innerHTML = '';

  products.forEach(product => {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      <button class="delete-product" onclick="deleteProduct(${product.id})">×</button>
  <img src="${product.imagem || 'img/default.png'}" width="120" height="120"> 
  <p>R$ ${product.price.toFixed(2)}</p>
  <button onclick="addToCart(${product.id})">Adicionar ao Carrinho</button>
    `;
    productList.appendChild(div);
  });
}

// Cadastro de Produto (continua igual, adiciona no mesmo array)
document.getElementById('add-product').addEventListener('click', () => {
  const name = document.getElementById('product-name').value.trim();
  const price = parseFloat(document.getElementById('product-price').value);

  if (name && price > 0) {
    products.push({ id: Date.now(), name, price });
    renderProducts(); // redesenha com o novo produto
    document.getElementById('product-name').value = '';
    document.getElementById('product-price').value = '';
  } else {
    alert('Preencha o nome e preço corretamente.');
  }
});

// Controle de navegação (mostra páginas e carrega fixos ao entrar em Produtos)
document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const page = link.getAttribute('data-page') || link.textContent.toLowerCase();

    // esconde tudo
    document.querySelectorAll(".page").forEach(sec => sec.classList.remove("active"));

    // mostra apenas a seção clicada
    const target = document.getElementById(page);
    if (target) target.classList.add("active");

    // Se clicou em Produtos → carrega fixos (uma vez) e renderiza tudo
    if (page === "produtos") {
      loadFixedProductsOnce();
      renderProducts();
    }
  });
});

// Funções de carrinho (usam product.id)
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return alert('Produto não encontrado.');

  const item = cart.find(i => i.product.id === productId);
  if (item) item.quantity += 1;
  else cart.push({ product, quantity: 1 });

  updateCart();
}
//Atualizar os itens exibidos no carrinho
function updateCart() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const cartCount = document.getElementById('cart-count');
//Limpando a lista antes de redesenhar
  cartItems.innerHTML = '';
  //Criando variáveis para somar  
  let total = 0;
  let count = 0;
//Percorrendo cada item do carrinho  
  cart.forEach(item => {
//Carrinho agora contém todos os itens adicionados.  
//Calculando o Valor
    total += item.product.price * item.quantity;
    count += item.quantity;

    const li = document.createElement('li');
    li.className = 'cart-item';
    //Programa desenhando o HTML do item para visualização do leitor.

    li.innerHTML = `
      <img src="${item.product.imagem || 'img/default.png'}" width="60" height="60">
      ${item.product.name} - R$ ${item.product.price.toFixed(2)}
      <input type="number" min="1" value="${item.quantity}" onchange="changeQuantity(${item.product.id}, this.value)">
      <button onclick="removeFromCart(${item.product.id})">X</button>
    `;

    cartItems.appendChild(li);
  });
//Atualizando o total em dinheiro
  cartTotal.textContent = `Total: R$ ${total.toFixed(2)}`;
  cartCount.textContent = count;
}

// Atualiza o contador no carrinho e recalcula o valor total
function changeQuantity(productId, newQuantity) {
  const item = cart.find(i => i.product.id === productId);
  if (item && newQuantity >= 1) {
    item.quantity = parseInt(newQuantity);
    updateCart();
  }
}
// Função remove um produto do carrinho.
function removeFromCart(productId) {
  cart = cart.filter(item => item.product.id !== productId);
  updateCart();
}

// Função exclui completamente o produto do sistema.
function deleteProduct(productId) {
  products = products.filter(p => p.id !== productId);
  cart = cart.filter(item => item.product.id !== productId);
  renderProducts();
  updateCart();
}

// Limpar carrinho / checkout / abrir-fechar (igual ao seu)
document.getElementById('clear-cart').addEventListener('click', () => {
  if (confirm('Deseja limpar o carrinho?')) {
    cart = [];
    updateCart();
  }
});

// Retorno sobre o carrinho
document.getElementById('checkout').addEventListener('click', () => {
  if (cart.length === 0) { alert('Seu carrinho está vazio.'); return; }
  alert('Compra realizada com sucesso!');
  cart = []; updateCart();
  document.getElementById('cart').classList.remove('show');
});

// Eventos dos botões de abrir carrinho e feichar carrinho

document.getElementById('open-cart').addEventListener('click', () => {
  document.getElementById('cart').classList.add('show');
});
document.getElementById('close-cart').addEventListener('click', () => {
  document.getElementById('cart').classList.remove('show');
});

// Inicial: mostrar Início (assume que '#inicio' exista).
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const inicio = document.getElementById('inicio');
  if (inicio) inicio.classList.add('active');
});
