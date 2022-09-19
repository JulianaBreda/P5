let detailsCart = ""
let finalPrice = 0;
let finalQuantity = 0;

function pageReady(myFunction){

    // Check if the page/document is loaded 
    if (document.readyState === "complete" || document.readyState === "interactive") {

        // If yes, starts myFunction in the next milisecond (tick)
        myFunction();
    } else {

        // If no, add myFunction to the browser event loaded page
        document.addEventListener("DOMContentLoaded", myFunction);
    }
}

// - new function - recalculate the total amount when an item is removed form the cart
function updateCart(){
  // Resets the totals of prices and quantities to recalculate
  finalPrice=0;
  finalQuantity=0;
  // get detailsCart from localStorage, since it was updated with -1 item
  detailsCart = JSON.parse(window.localStorage.getItem('detailsCart'));
  // goes through each item in the collection again
  detailsCart.collection.forEach(function(product, index, array){
    // Consults the API again to get the price of the item 
    fetch("http://localhost:3000/api/products/"+product.id)
    .then(function(response){return response.json()})
    .then(function(item){
      // Recalculate the prices and quantities to update the HTML fields
      finalPrice = finalPrice+(item.price*parseInt(product.quantity));
      finalQuantity = finalQuantity+parseInt(product.quantity);

      // Update HTML with new quantites and prices, after removing item from the cart
      let htmlTotalPrice = document.getElementById('totalPrice');
      let htmlTotalQuantity = document.getElementById('totalQuantity');
      htmlTotalPrice.innerHTML = finalPrice;
      htmlTotalQuantity.innerHTML = finalQuantity;
    });
  });
  if (finalQuantity==0){
      let htmlTotalPrice = document.getElementById('totalPrice');
      let htmlTotalQuantity = document.getElementById('totalQuantity');
      htmlTotalPrice.innerHTML = finalPrice;
      htmlTotalQuantity.innerHTML = finalQuantity;
  }
}

// New function to remove items from the cart - visto que não podemos utilizar o data-index para deletar no detailsCart (sem dar refresh na página)
// This fucntion gets as a parameter the product ID and product colors of the product to be removed from the cart
function deleteItemFromCart(id,colors){
  let itemWasRemoved = false;
  // goes item by item of the detailsCart searching for the item with the same ID and COLORS informed in the fucntion
  detailsCart.collection.forEach(function(item,index,array){
    if(item.id == id && item.colors == colors){
      // If finds, then remove the product from the array "collection" from the detailsCart
      array.splice(index,1);
      // informs if the item was deleted (true)
      itemWasRemoved = true;
    }
  });
  // Updates the localStorage with the detailsCart without the product
  window.localStorage.setItem('detailsCart',JSON.stringify(detailsCart));
  // Executes the function update total price/qtd of the cart
  updateCart();
  // Return TRUE ou FALSE (if deleted or not)
  return itemWasRemoved;
}

//Criei uma função para ATUALIZAR a quantidade do produto que o cliente alterou (Qté)
function updateItemFromCart(id,colors,newQuantity){
  let quantTotalCart = 0;
  detailsCart.collection.forEach(function(item,index, array){
    quantTotalCart = quantTotalCart + parseInt(item.quantity);
  });
  if ((quantTotalCart+parseInt(newQuantity))<=100){
    detailsCart.collection.forEach(function(item,index,array){
      if(item.id == id && item.colors == colors){
        item.quantity = newQuantity;
      }
    
    });
    // Updates the localStorage with theupdated with the new quantity
    window.localStorage.setItem('detailsCart',JSON.stringify(detailsCart));
    // Executes the function to update price/qtd
    updateCart();
  }  
  else {
    alert ("quantité max 100 articles")
    location.reload();
  }
}

// Execute the handler through an anonymous function as parameter. This function will fetch the data in the backend and 
// add the items to the page/document (html "section id=items")
pageReady(function(){
  // gets the shopping cart information at the local storage
  detailsCart = JSON.parse(window.localStorage.getItem('detailsCart'));
  let listProducts = document.getElementById("cart__items");

  // Prints each product included on the localStorage (array "collection") on the html, also including functions on some links/inputs
  detailsCart.collection.forEach(function(product, index, array){
    fetch("http://localhost:3000/api/products/"+product.id)
    .then(function(response){return response.json()})
    .then(function(item){
      let productImage = item.imageUrl;
      let productPrice = item.price;
      let productAlt = item.altTxt;
      let productName = item.name;

      finalPrice = finalPrice+(item.price*parseInt(product.quantity));
      finalQuantity = finalQuantity+parseInt(product.quantity);
      let htmlContent = "<article class=\"cart__item\" data-index=\""+index+"\" data-id=\""+product.id+"\" data-color=\""+product.colors+"\"> \
                          <div class=\"cart__item__img\"> \
                            <img src=\""+productImage+"\" alt=\""+productAlt+"\"> \
                          </div> \
                          <div class=\"cart__item__content\"> \
                            <div class=\"cart__item__content__description\"> \
                              <h2>"+productName+"</h2> \
                              <p>"+product.colors+"</p> \
                              <p>"+(productPrice*product.quantity)+"€</p> \
                            </div> \
                            <div class=\"cart__item__content__settings\"> \
                              <div class=\"cart__item__content__settings__quantity\"> \
                                <p>Qté : </p> \
                                <input type=\"number\" class=\"itemQuantity\" name=\"itemQuantity\" min=\"1\" max=\"100\" value=\""+product.quantity+"\"> \
                              </div> \
                              <div class=\"cart__item__content__settings__delete\"> \
                                <p class=\"deleteItem\" >Supprimer</p> \
                              </div> \
                            </div> \
                          </div> \
                        </article>";
  
      let doc = new DOMParser().parseFromString(htmlContent,"text/html"); // Esta linha converte a string que montamos na variável htmlContent em "objeto HTML" (DOM) e salva na variável doc
      let recentArticles=doc.getElementsByClassName("cart__item"); // Coleta somente o objeto que contém a classe "cart__item", ou seja, somente pega o abjeto "<article>" recém criado e salva na variável "recentArticles"
      listProducts.appendChild(recentArticles[0]); // Agora sim, anexa somente este objeto (posição 0) ao HTML do carrinho, dentro da tag "<section id='cart__items'>"

      //functions that shows final amount dinamically on the HTML
      let htmlTotalPrice = document.getElementById('totalPrice');
      let htmlTotalQuantity = document.getElementById('totalQuantity');
      htmlTotalPrice.innerHTML = finalPrice;
      htmlTotalQuantity.innerHTML = finalQuantity;

      // Selects the last article added to the section cart__items
      let articleItem = listProducts.children[listProducts.children.length-1];

      // Selects the child p element with the class=deleteItem
      let deleteItem = articleItem.querySelector(".deleteItem");
      deleteItem.addEventListener("click",function(event){
        let article = this.closest("article");
        
        // new function - deleteItemFromCart if return true or false (if it was deleted or not from the localStorage)
        if(deleteItemFromCart(article.dataset.id,article.dataset.color)){
          // if deleted, commands to remove "<article>" from HTML
          article.remove();
        }
      },false);

      //# Início da alteração 2 # Adicionei já também na mesma promise, funções para quando o cliente mudar as quantidades no carrinho
      let inputQuantity = articleItem.querySelector('.itemQuantity');
      let originalQuantity = inputQuantity.value;
      inputQuantity.addEventListener("change",function(event){
        if(this.value >100 || (this.value <=0 && this.value !="") || this.value % 1 !=0){
          alert("quantité non autorisée - choisissez un valeur entre 1 - 100")
          location.reload();
        }
        else {
          let article=this.closest("article");
          updateItemFromCart(article.dataset.id,article.dataset.color,this.value);        
        }   
      });
    });
  });
  //FORM VALIDATION - creates the form eventListener
  let formCart = document.getElementsByClassName("cart__order__form");
  formCart[0].addEventListener("submit", function(event){
    event.preventDefault()
    let firstName = document.getElementById("firstName");
    let lastName = document.getElementById("lastName");
    let address = document.getElementById("address");
    let city = document.getElementById("city");
    let email = document.getElementById("email");
    let firstNameValidation = allLetters(firstName); 
    let lastNameValidation = allLetters(lastName);
    let cityValidation = allLetters(city);
    let emailValidation = checkEmail();
    if(firstNameValidation && lastNameValidation && cityValidation && emailValidation) {
      detailsCart = JSON.parse(window.localStorage.getItem('detailsCart'));
      let arrayProducts = [];
      detailsCart.collection.forEach(function(item, index, array){
        arrayProducts.push(item.id)
      })
      let order = { //creates the object CONTACT to send to the API
        contact : {
          firstName: firstName.value, 
          lastName : lastName.value,
          address : address.value,
          city : city.value,
          email : email.value,      
        },
        products : arrayProducts
      }
      console.log(order);
      const fetchOption = {
        method: "POST",
        headers: { 
          
          'Accept':'application/json',
          'Content-Type': 'application/json',
        }, 
        body: JSON.stringify(order)
      }; 

      fetch("http://localhost:3000/api/products/order", fetchOption)        
      .then((res) => { 
        if(res.ok){
          return res.json();
        }   
      })   //API response
      .then((data) => {
        let orderId = data.orderId;
        window.location = "confirmation.html?orderId="+orderId;
        })
      .catch ((error) => console.log(error))
        }
  })
});
// FORM VALIDATION - checks if there is only letters on the form champ nom and prenom and city
function allLetters(input){
  let letters = /^[\-/A-Za-z\u00C0-\u017F ]+$/;
  let inputName = "";
    if (input.value.match(letters)){
        return true;
    }
    else {
        if(input.id == "firstName"){
          let firstNameError =  document.getElementById("firstNameErrorMsg");
          firstNameError.innerHTML = "caractères non autorisés - ce champ accepte uniquement des lettres"
        }
        else {
          let firstName = document.getElementById("firstName")
          if(firstName.value.match(letters)){
            let firstNameError =  document.getElementById("firstNameErrorMsg");
            firstNameError.innerHTML = ""
          } 
        }

        if(input.id == "lastName"){
          let lastNameError = document.getElementById("lastNameErrorMsg");
          lastNameError.innerHTML = "caractères non autorisés - ce champ accepte uniquement des lettres"
        }
        else {
          let lastName = document.getElementById("lastName")
          if(lastName.value.match(letters)){
            let lastNameError =  document.getElementById("lastNameErrorMsg");
            lastNameError.innerHTML = "" 
          }
        }

        if(input.id == "city"){
          let cityError = document.getElementById("cityErrorMsg");
          cityError.innerHTML = "caractères non autorisés - ce champ accepte uniquement des lettres"
        }
        else {
          let city = document.getElementById("city")
          if(city.value.match(letters)){
            let cityError =  document.getElementById("cityErrorMsg");
            cityError.innerHTML = ""
          }
        }
        
        return false;
    }
}
// checks if there is an error on the form field 'email'
function checkEmail() {

  let email = document.getElementById('email');
  let filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (!filter.test(email.value)) {
      let emailError = document.getElementById("emailErrorMsg");
      emailError.innerHTML = "l'adresse email indiqué n'est pas valide"
      email.focus();
      return false;
    }
    else {
      let emailError =  document.getElementById("emailErrorMsg");
      emailError.innerHTML = "" 
      return true;
    }
}
