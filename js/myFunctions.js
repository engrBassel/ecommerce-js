export function getCartProducts() {
  return JSON.parse(localStorage.getItem("cartProducts"));
}

export function setCartProducts(toBeSet) {
  localStorage.setItem("cartProducts", JSON.stringify(toBeSet));
}

export function myCreateElement(elementType) {
  return document.createElement(elementType);
}

export function myCreateTextNode(txt) {
  return document.createTextNode(txt);
}

export function myCreateElementWithTextNode(elementType, txt) {
  const element = myCreateElement(elementType);
  const elementTxt = myCreateTextNode(txt);
  element.appendChild(elementTxt);
  return element;
}

export function myCreateElementWithClass(elementType, elementClassName) {
  const element = myCreateElement(elementType);
  element.className = elementClassName;
  return element;
}

export function myCreateElementWithTextNodeAndClass(
  elementType,
  txt,
  elementClassName
) {
  const element = myCreateElementWithTextNode(elementType, txt);
  element.className = elementClassName;
  return element;
}

export function myCreateBtnWithClassAndIcon(elementClass, elementIconClass) {
  const element = myCreateElement("button");
  element.type = "button";
  element.className = elementClass;
  const elementIcon = myCreateElementWithClass("i", elementIconClass);
  element.appendChild(elementIcon);
  return element;
}

export function myCreateImg(imgSrc, imgAlt) {
  const imgElement = myCreateElement("img");
  imgElement.src = imgSrc;
  imgElement.alt = imgAlt;
  return imgElement;
}
