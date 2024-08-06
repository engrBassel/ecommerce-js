import {
  getCartProducts,
  setCartProducts,
  myCreateElement,
  myCreateTextNode,
  myCreateElementWithClass,
  myCreateElementWithTextNode,
  myCreateElementWithTextNodeAndClass,
  myCreateBtnWithClassAndIcon,
  myCreateImg,
} from "./myFunctions.js";

// select elements
const clearCartBtn = document.querySelector("#clear-cart-btn");
const cartProductsDiv = document.querySelector("#cart-products");
const noProductsTxt = myCreateTextNode("Empty Cart!");
const cartTotalPriceParagraph = document.querySelector("#cart-total p");

let cartProducts = getCartProducts();
let cartTotal = 0;

// add cart products to the page
displayCartProducts();

// add event listener to clear cart btn
clearCartBtn.addEventListener("click", () => {
  // clear cart products in page
  cartProductsDiv.textContent = "";
  // reset total
  cartTotal = 0;
  // style cart as empty and add empty txt
  cartIsEmpty();
  updateDisplayedTotal();
  clearLocalStorage();
});

// add total span to page
const cartTotalPriceSpan = myCreateElementWithTextNode(
  "span",
  cartTotal.toFixed(2)
);
cartTotalPriceParagraph.appendChild(cartTotalPriceSpan);

// functions
function displayCartProducts() {
  if (!cartProducts) {
    cartIsEmpty();
  } else {
    // for cart div
    cartProductsDiv.parentElement.classList.remove("empty");
    // for products div
    cartProductsDiv.classList.remove("empty");
    cartProducts.forEach((currProduct, currIndx) => {
      createCartProduct(currProduct, currIndx);
      cartTotal += currProduct.price * currProduct.quantity;
    });
  }
}

function cartIsEmpty() {
  cartProductsDiv.appendChild(noProductsTxt);
  // for cart div
  cartProductsDiv.parentElement.classList.add("empty");
  // for products div
  cartProductsDiv.classList.add("empty");
}

function createCartProduct(currProduct, currIndx) {
  const cartProduct = myCreateElementWithClass("div", "cart-product");

  // create cart product info
  const cartProductInfo = myCreateElementWithClass("div", "cart-product-info");

  // create cart product img and put it in product info
  const cartProductImgDiv = myCreateElementWithClass(
    "div",
    "card-img cart-product-img"
  );
  const cartProductImg = myCreateImg(currProduct.image, currProduct.title);

  cartProductImgDiv.appendChild(cartProductImg);
  cartProductInfo.appendChild(cartProductImgDiv);

  // create name and price div and put it in product info
  const cartProductNameAndPrice = myCreateElement("div");

  const cartProductName = myCreateElementWithTextNode("h2", currProduct.title);

  const cartProductPrice = myCreateElementWithTextNodeAndClass(
    "p",
    `$${currProduct.price}/Piece`,
    "card-price"
  );

  cartProductNameAndPrice.appendChild(cartProductName);
  cartProductNameAndPrice.appendChild(cartProductPrice);
  cartProductInfo.appendChild(cartProductNameAndPrice);

  // put cart product info in the cart product
  cartProduct.appendChild(cartProductInfo);

  // create cart product btns
  const cartProductBtns = myCreateElementWithClass("div", "cart-product-btns");
  const quantityBtns = myCreateElementWithClass("div", "quantity-btns");

  const minusBtn = myCreateBtnWithClassAndIcon(
    "btn btn-light red-white-hover click-effect",
    "fa-solid fa-minus"
  );
  minusBtn.title = "Decrease Quantity";

  // add event listener for minus btn
  minusBtn.addEventListener("click", (e) => {
    if (currProduct.quantity > 1) {
      cartProducts[currIndx].quantity--;
      cartProductquantity.textContent--;
      setCartProducts(cartProducts);
      cartTotal -= currProduct.price;
      updateDisplayedTotal();
    } else {
      removeCartProduct(currProduct, e.currentTarget.parentElement);
    }
  });

  const cartProductquantity = myCreateElementWithTextNode(
    "p",
    currProduct.quantity
  );

  const plusBtn = myCreateBtnWithClassAndIcon(
    "btn btn-light green-white-hover click-effect",
    "fa-solid fa-plus"
  );
  plusBtn.title = "Increase Quantity";

  // add event listener for plus btn
  plusBtn.addEventListener("click", () => {
    cartProducts[currIndx].quantity++;
    cartProductquantity.textContent++;
    setCartProducts(cartProducts);
    cartTotal += currProduct.price;
    updateDisplayedTotal();
  });

  quantityBtns.appendChild(minusBtn);
  quantityBtns.appendChild(cartProductquantity);
  quantityBtns.appendChild(plusBtn);

  cartProductBtns.appendChild(quantityBtns);

  const removeBtn = myCreateBtnWithClassAndIcon(
    "btn btn-light red-white-hover click-effect",
    "fa-regular fa-trash-can"
  );
  removeBtn.title = "Remove Product";

  // add event listener for remove btn
  removeBtn.addEventListener("click", (e) => {
    removeCartProduct(currProduct, e.currentTarget);
  });

  cartProductBtns.appendChild(removeBtn);
  cartProduct.appendChild(cartProductBtns);

  // put cart product in cart products div
  cartProductsDiv.appendChild(cartProduct);
}

function removeCartProduct(toBeRemovedProduct, clickedElement) {
  if (cartProducts.length === 1) {
    clearLocalStorage();
    cartIsEmpty();
    cartTotal = 0;
  } else {
    cartProducts = cartProducts.filter(
      (currProduct) => currProduct.id !== toBeRemovedProduct.id
    );
    setCartProducts(cartProducts);
    cartTotal -= toBeRemovedProduct.quantity * toBeRemovedProduct.price;
  }
  clickedElement.parentElement.parentElement.remove();
  updateDisplayedTotal();
}

function updateDisplayedTotal() {
  cartTotalPriceSpan.textContent = cartTotal.toFixed(2);
}

function clearLocalStorage() {
  localStorage.removeItem("cartProducts");
}
