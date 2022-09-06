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

//# Início da alteração - Adicionei uma nova função que recalcula o total a pagar depois que um item é removido do carrinho
function updateCart(){
  // Zera os totais de preçoes e quantidades para refazer o calculo
  finalPrice=0;
  finalQuantity=0;
  // Pega novamente o detailsCart da localStorage, já que ele foi atualizado com -1 item
  detailsCart = JSON.parse(window.localStorage.getItem('detailsCart'));
  // Percorre novamente cada item da collection
  detailsCart.collection.forEach(function(product, index, array){
    // Consulta a API novamente apenas para pegar o preço deste item
    fetch("http://localhost:3000/api/products/"+product.id)
    .then(function(response){return response.json()})
    .then(function(item){
      // Recalcula os preços e quantidades para atualizar nos campos html
      finalPrice = finalPrice+(item.price*parseInt(product.quantity));
      finalQuantity = finalQuantity+parseInt(product.quantity);

      // Atualiza os campos HTML com novas quantidades e preços, após remover item do carrinho
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
//# Fim da alteração #//

//# Início da alteração 2 - Criei uma função que REMOVE itens do carrinho, visto que não podemos utilizar o data-index para deletar no detailsCart (sem dar refresh na página)
// Esta função recebe como parâmetro o ID do produto e a COLORS do produto a ser removido do carrinho
function deleteItemFromCart(id,colors){
  // Inseri uma nova flag para detectar se o item foi realmente removido com este ID e COLORS informado na função
  let itemWasRemoved = false;
  // Passa item por item do detailsCart procurando pelo item com ID e COLORS informado na função
  detailsCart.collection.forEach(function(item,index,array){
    if(item.id == id && item.colors == colors){
      // Se encontrou, então remove o produto do array "collection" do detailsCart
      array.splice(index,1);
      // E informa que conseguiu deletar (true)
      itemWasRemoved = true;
    }
  });
  // Atualiza o localStorage com o detailsCart sem o produto removido
  window.localStorage.setItem('detailsCart',JSON.stringify(detailsCart));
  // Executa a função de atualizar preço/qtd total do carrinho
  updateCart();
  // Retorna o valor TRUE ou FALSE (se deletou ou não)
  return itemWasRemoved;
}
//# Fim da alteração 2 #//

//# Início da alteração 2 - Criei uma função para ATUALIZAR a quantidade do produto que o cliente alterou (Qté)
function updateItemFromCart(id,colors,newQuantity){
    detailsCart.collection.forEach(function(item,index,array){
    if(item.id == id && item.colors == colors){
      item.quantity = newQuantity;
    }
  });
  // Atualiza o localStorage com o detailsCart já atualizado com nova quantidade
  window.localStorage.setItem('detailsCart',JSON.stringify(detailsCart));
  // Executa a função de atualizar preço/qtd total do carrinho
  updateCart();
}
//# Fim da alteração 2 #//

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
                              <p>"+productPrice+"€</p> \
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
      //# Início de alteração # Troquei a linha "listProducts.innerHTML += htmlContent;" pelas 3 linhas abaixo:
      let doc = new DOMParser().parseFromString(htmlContent,"text/html"); // Esta linha converte a string que montamos na variável htmlContent em "objeto HTML" (DOM) e salva na variável doc
      let recentArticles=doc.getElementsByClassName("cart__item"); // Coleta somente o objeto que contém a classe "cart__item", ou seja, somente pega o abjeto "<article>" recém criado e salva na variável "recentArticles"
      listProducts.appendChild(recentArticles[0]); // Agora sim, anexa somente este objeto (posição 0) ao HTML do carrinho, dentro da tag "<section id='cart__items'>"
      //# Fim da alteração #//

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
        //# Início de alteração 2 # Corrigi a linha abaixo para não mais usar o "data-index" quando for deletar, mas sim passa o data-id e data-color
        // Primeiro, chama a nova função de deleteItemFromCart e verifica se o retorno é verdadeiro ou falso (se deletou do localStorage ou não)
        if(deleteItemFromCart(article.dataset.id,article.dataset.color)){
          // Se deletou com sucesso, dá o comando de remover o "<article>" do HTML
          article.remove();
        }
        //# Fim da alteração 2 #//
      },false);

      //# Início da alteração 2 # Adicionei já também na mesma promise, funções para quando o cliente mudar as quantidades no carrinho
      let inputQuantity = articleItem.querySelector('.itemQuantity');
      inputQuantity.addEventListener("change",function(event){
        let article=this.closest("article");
        updateItemFromCart(article.dataset.id,article.dataset.color,this.value)
      });
      //# Fim da alteração 2 #//
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
      let order = { //creates the object CONTACT
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
  let letters = /^[a-zA-Z ]+$/;
  let inputName = "";
    if (input.value.match(letters)){
        return true;
    }
    else {
        if(input.id == "firstName"){
          let firstNameError =  document.getElementById("firstNameErrorMsg");
          firstNameError.innerHTML = "caractères non autorisés"
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
          lastNameError.innerHTML = "caractères non autorisés"
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
          cityError.innerHTML = "caractères non autorisés"
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
// checks if there is an error on the form champ email
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
