class Product {
  constructor(title, imageUrl, price, description) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }
}

class ElementAttribute {
  constructor(attrName, attrValue) {
    this.name = attrName;
    this.value = attrValue;
  }
}

class Component {
  constructor(renderHookId, shouldRender = true) {
    this.hookId = renderHookId;
    if (shouldRender) {
      this.render();
    }
  }

  render() {}

  createRootElement(tag, cssClass, attributes) {
    const rootElement = document.createElement(tag);
    if (cssClass) {
      rootElement.className = cssClass;
    }
    if (attributes && attributes.length > 0) {
      for (const attr of attributes) {
        rootElement.setAttribute(attr.name, attr.value);
      }
    }
    document.getElementById(this.hookId).append(rootElement);
    return rootElement;
  }
}

class ShoppingCart extends Component {
  constructor(renderHookId) {
    super(renderHookId);
  }
  items = [];

  set cartItems(value) {
    this.items = value;
    this.totalOutput.innerHTML = `<h2>Total: £${this.totalAmount}</h2>`;
  }

  get totalAmount() {
    const sum = this.items.reduce((a, b) => a + b.price, 0).toFixed(2);
    return sum;
  }

  addProduct(product) {
    const updatedItems = [...this.items];
    updatedItems.push(product);
    this.cartItems = updatedItems;
  }

  orderProducts() {
    console.log('Ordering...', this.items);
  }

  render() {
    const cartElement = this.createRootElement('section', 'cart');
    cartElement.innerHTML = `
    <h2>Total: £${0}</h2>
    <button>Order now</button>
    `;
    const orderButton = cartElement.querySelector('button');
    orderButton.addEventListener('click', () => this.orderProducts());
    this.totalOutput = cartElement.querySelector('h2');
  }
}

class ProductItem extends Component {
  constructor(product, renderHookId) {
    super(renderHookId, false);
    this.product = product;
    this.render();
  }
  addToCart() {
    App.addProductToCart(this.product);
  }
  render() {
    const productElement = this.createRootElement('li', 'product-item');

    productElement.innerHTML = `
      <div>
          <div class="product-item__content">
              <h2>${this.product.title}</h2>
              <h3>£${this.product.price} </h3>
              <p>${this.product.description}</p>
              <button>Add to cart</button>
          </div>

          <img src="${this.product.imageUrl}">

      </div>
      `;
    const addToCartButton = productElement.querySelector('button');
    addToCartButton.addEventListener('click', this.addToCart.bind(this));
  }
}

class ProductList extends Component {
  products = [];
  constructor(renderHookId) {
    super(renderHookId);
    this.fetchProducts();
  }

  fetchProducts() {
    this.products = [
      new Product(
        'Pillow',
        'https://www.fatboy.com/assets/image/000/007/680/FATBOY_King-Pillow-Outdoor_Stripe-Blue-Ocean_Packshot_104571.jpg',
        19.99,
        'A lovely, soft pillow'
      ),
      new Product(
        'Rug',
        'https://www.trendcarpet.co.uk/images/zoom/03378-84947.jpg',
        59.99,
        'A lovely, decorative rug'
      ),
    ];
    this.renderProducts();
  }

  renderProducts() {
    for (const prod of this.products) {
      new ProductItem(prod, 'prod-list');
    }
  }

  render() {
    this.createRootElement('ul', 'product-list', [
      new ElementAttribute('id', 'prod-list'),
    ]);
    if (this.products && this.products.length > 0) {
      this.renderProducts();
    }
  }
}

class Shop extends Component {
  constructor() {
    super();
  }
  render() {
    this.cart = new ShoppingCart('app');
    new ProductList('app');
  }
}

class App {
  static cart;

  static init() {
    const shop = new Shop();
    this.cart = shop.cart;
  }
  static addProductToCart(product) {
    this.cart.addProduct(product);
  }
}

App.init();
