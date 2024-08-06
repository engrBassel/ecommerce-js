import {
  getCartProducts,
  setCartProducts,
  myCreateElementWithClass,
  myCreateElementWithTextNode,
  myCreateElementWithTextNodeAndClass,
  myCreateImg,
} from "./myFunctions.js";

// select elements
const searchInput = document.querySelector("#search input");
const cartIconCountSpan = document.querySelector("#cart-icon-count");
const productsSection = document.querySelector("#products");
const sortingSelectElement = document.querySelector("#sorting-select select");
const categorySelectElement = document.querySelector("#category-select select");

// start app after content loaded
document.addEventListener("DOMContentLoaded", app);

async function app() {
  const products = await getData();
  // create array of products as html elements
  const productsElements = products.map((currProduct) => {
    // create product card and add data attribute
    const productCard = myCreateElementWithClass("div", "card");
    productCard.dataset.title = currProduct.title;
    productCard.dataset.category = currProduct.category;
    productCard.dataset.price = currProduct.price;

    // create product image and put it in the product card
    const productImgDiv = myCreateElementWithClass(
      "div",
      "card-img product-img"
    );
    const productImg = myCreateImg(currProduct.image, currProduct.title);
    productImgDiv.appendChild(productImg);
    productCard.appendChild(productImgDiv);

    // create product name and put it in the product card
    const productName = myCreateElementWithTextNodeAndClass(
      "h3",
      currProduct.title,
      "product-name"
    );
    productCard.appendChild(productName);

    // create product price and put it in the product card
    const productPrice = myCreateElementWithClass("p", "card-price");

    const dollarSignSpan = myCreateElementWithTextNodeAndClass(
      "span",
      "$",
      "white-color"
    );
    productPrice.appendChild(dollarSignSpan);

    const productPriceSpan = myCreateElementWithTextNode(
      "span",
      currProduct.price.toFixed(2)
    );
    productPrice.appendChild(productPriceSpan);

    productCard.appendChild(productPrice);

    // create product description and put it in the product card
    const productDesc = myCreateElementWithTextNodeAndClass(
      "p",
      `${currProduct.description.substring(0, 100)}...`,
      "product-desc"
    );
    productDesc.title = currProduct.description;
    productCard.appendChild(productDesc);

    // create product cart btn with click event and put it in the product card
    const addToCartBtn = myCreateElementWithTextNodeAndClass(
      "button",
      "Add to cart",
      "btn btn-dark btn-full dark-hover"
    );
    addToCartBtn.type = "button";

    addToCartBtn.addEventListener("click", () => {
      // get saved cart products in local storage
      const cartProducts = getCartProducts();

      // check if it is empty or not
      if (!cartProducts) {
        cartIconCountSpan.classList.add("show");
        setCartProducts([{ ...currProduct, quantity: 1 }]);
      } else {
        const cartProductToBeAdded = cartProducts.find(
          (cartProduct) => cartProduct.id === currProduct.id
        );

        if (!cartProductToBeAdded) {
          setCartProducts([...cartProducts, { ...currProduct, quantity: 1 }]);
        } else {
          cartProducts[cartProducts.indexOf(cartProductToBeAdded)].quantity++;
          setCartProducts(cartProducts);
        }
      }

      // animation of adding product to cart
      addToCartBtn.classList.add("animated");
      setTimeout(() => {
        addToCartBtn.classList.remove("animated");
      }, 1100);

      // update number of cart products on the cart icon
      cartIconCountSpan.textContent++;
    });

    productCard.appendChild(addToCartBtn);

    return productCard;
  });

  // display products in the page
  displayProductsElements(productsElements);

  // add categories to the select element
  fillCategories(products);

  // show cart products count on cart icon
  displayCartCount();

  // add event listener to search and two selects
  searchInput.addEventListener("keyup", () => handleChange(productsElements));

  sortingSelectElement.addEventListener("change", () =>
    handleChange(productsElements)
  );

  categorySelectElement.addEventListener("change", () =>
    handleChange(productsElements)
  );
}

async function getData() {
  try {
    const data = await fetch("https://fakestoreapi.com/products?limit=18");
    const productsArr = await data.json();
    return productsArr;
  } catch (error) {
    const h4 = myCreateElementWithTextNode("h4", error);
    productsSection.appendChild(h4);
  }
}

// functions
function displayProductsElements(elementsArr) {
  productsSection.textContent = "";

  elementsArr.forEach((currElement) => {
    productsSection.appendChild(currElement);
  });
}

function fillCategories(productsArr) {
  const categories = [];

  productsArr.forEach((product) => {
    // ignore the category if it already exists
    if (!categories.includes(product.category)) {
      categories.push(product.category);
    }
  });

  categories.forEach((productCategory) => {
    const categoryOption = myCreateElementWithTextNode(
      "option",
      productCategory[0].toUpperCase() + productCategory.slice(1)
    );

    categoryOption.value = productCategory;

    categorySelectElement.appendChild(categoryOption);
  });
}

function displayCartCount() {
  const cartProducts = getCartProducts();
  let cartCount = 0;

  cartProducts?.forEach((currProduct) => {
    cartCount += currProduct.quantity;
  });

  if (cartCount > 0) {
    cartIconCountSpan.classList.add("show");
    cartIconCountSpan.textContent = cartCount;
  }
}

function handleChange(initialProductsElements) {
  let newProductsElements = [...initialProductsElements];
  const searchedProduct = searchInput.value;
  const selectedSorting = sortingSelectElement.value;
  const selectedCategory = categorySelectElement.value;

  if (searchedProduct !== "") {
    newProductsElements = initialProductsElements.filter((currProduct) =>
      currProduct.dataset.title.toLowerCase().includes(searchedProduct)
    );
  }

  if (selectedSorting !== "no") {
    newProductsElements.sort((a, b) => {
      if (selectedSorting === "l2h") return a.dataset.price - b.dataset.price;
      if (selectedSorting === "h2l") return b.dataset.price - a.dataset.price;
    });
  }

  displayProductsElements(newProductsElements);

  // remove hide class from all
  newProductsElements.forEach((currElement) => {
    currElement.classList.remove("hidden");
  });

  // add class hide on the unwanted products
  if (selectedCategory !== "all") {
    newProductsElements.forEach((currElement) => {
      if (currElement.dataset.category !== selectedCategory) {
        currElement.classList.add("hidden");
      }
    });
  }
}
