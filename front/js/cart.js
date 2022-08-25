var detailsCart = ""
var finalPrice = 0;
var finalQuantity = 0;
// checks if there is only letters on the form champ nom and prenom
function allLetters(firstName){
    var letters = /^[a-zA-Z]+$/;
    if (firstName.value.match(letters)){
        return true;
    }
    if (lastName.value.match(letters)){
        return true;
    }
    else {
        alert ('caractères invalides')
    }
}
// checks if there is an error on the form champ email
function checkEmail() {

    var email = document.getElementById('email');
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (!filter.test(email.value)) {
    alert("l'adresse email indiqué n'est pas valide");
    email.focus;
    return false;
 }
}

function pageReady(myFunction){

    // Check if the page/document is loaded 
    if (document.readyState === "complete" || document.readyState === "interactive") {

        // If yes, starts myFunction in the next milisecond (tick)
        setTimeout(myFunction, 1);
    } else {

        // If no, add myFunction to the browser event loaded page
        document.addEventListener("DOMContentLoaded", myFunction);
    }
}

// Execute the handler through an anonymus function as parameter. This function will fetch the data in the backend and 
// add the items to the page/document (html "section id=items")
pageReady(function(){

// gets the shopping cart information at the local storage
detailsCart = JSON.parse(window.localStorage.getItem('detailsCart'));
var listProducts = document.getElementById("cart__items")

detailsCart.collection.forEach(function(product, index, array){
    fetch("http://localhost:3000/api/products/"+product.id)
    .then(function(response){return response.json()})
    .then(function(item){
    
    var productImage = item.imageUrl;
    var productPrice = item.price;
    var productAlt = item.altTxt;
    var productName = item.name;
    finalPrice = finalPrice+(item.price*parseInt(product.quantity));
    finalQuantity = finalQuantity+parseInt(product.quantity);
    var htmlContent = "<article class=\"cart__item\" data-index=\""+index+"\" data-id=\""+product.id+"\" data-color=\""+product.colors+"\"> \
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
        listProducts.innerHTML += htmlContent;
  //functions that shows final amount dinamically on the HTML

 var htmlTotalPrice = document.getElementById('totalPrice');
 var htmlTotalQuantity = document.getElementById('totalQuantity');
 htmlTotalPrice.innerHTML = finalPrice;
 htmlTotalQuantity.innerHTML = finalQuantity;

 // Selects the last article added to the section cart__items
var articleItem = listProducts.children[0];
// Selects the child p element with the class=deleteItem
var deleteItem = articleItem.querySelector(".deleteItem");
  deleteItem.addEventListener("click",function(event){
    var article = this.closest("article");
    console.log(article)
    var articleIndex = article.index;
    console.log(articleIndex)
    article.remove() 
  },false)
    })

})
})
