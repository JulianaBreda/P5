let saveId = "";
let colors = "";
let quantity = "";
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

// Execute the handler through an anonymus function as parameter. This function will fetch the data in the backend and 
// add the items to the page/document (html "section id=items")
pageReady(function(){

// sets an alert when the user choses <100 items
    quantity = document.getElementById("quantity")
    quantity.addEventListener("input",function(event){
        if(quantity.value >100){
            alert("quantité non autorisée")
            quantity.value = 1
        }
    },false)
//sets an alert when the user dont choose the quantity and/or color
    let button = document.getElementById("addToCart")
    button.addEventListener("click", function(event){
        colors = document.getElementById("colors")
        //verifica se a quantidade é igual 0
        if(quantity.value == ""|| quantity.value == 0){
            alert("chosissez une quantité")
        }
        else{//so executa quando quantidade for diferente de zero
            //verifica se tem cor selecionada
            if(colors.value == ""){
                alert ("choisissez une couleur")
            }
            else{//so executa se usuario escolher a cor
        
                //Creates an array with cart information to be stored at local storage
                let currentCart = window.localStorage.getItem('detailsCart');
                // Se o carrinho atual estiver vazio
                if(currentCart == null){
                    let detailsCart = {"collection":[{"id":saveId, "quantity":quantity.value, "colors":colors.value}]};
                    window.localStorage.setItem('detailsCart',JSON.stringify(detailsCart));
                    location.href = 'cart.html'
                }
                else{ // Caso o carrinho contenha algum item, verifica primeiro se já existe com mesmo ID e COLOR
                    // Carrega o carrinho na cartContent
                    let cartContent = JSON.parse(currentCart);
                    // Inicia variaveis de controle (flags) pra ver se achou
                    let foundSameItem = 0;
                    let indexSameItem = -1;
                    
                    // Percorre todos os items comparando ID e COLOR para ver se encontrou
                    cartContent.collection.forEach(function(item,index,array){
                        if(item.id == saveId && item.colors == colors.value){
                            foundSameItem = 1;
                            indexSameItem = index;
                        }
                    });

                    // Se encontrou um item identico, apenas atualiza o valor e salva na localStore
                    if(foundSameItem == 1 && indexSameItem > -1){
                        cartContent.collection[indexSameItem].quantity = parseInt(cartContent.collection[indexSameItem].quantity) + parseInt(quantity.value);
                        window.localStorage.setItem('detailsCart', JSON.stringify(cartContent));
                        location.href = 'cart.html';
                    }
                    else{ // Se caso não encontrou, adiciona o produto como se fosse um novo item do carrinho
                        let currentProduct = {"id":saveId, "quantity":quantity.value, "colors":colors.value};
                        cartContent.collection.push(currentProduct)
                        window.localStorage.setItem('detailsCart', JSON.stringify(cartContent));
                        location.href = 'cart.html'
                    }
                }
            }
        }
    },false)

// INSERT COMMENT
    const parametreUrl = new URLSearchParams(window.location.search);
    saveId = parametreUrl.get('id');

   
    fetch("http://localhost:3000/api/products/"+saveId)
    .then(function(response){return response.json()})
    .then(function(item){
    
        let productDetail = item;
        // Command to define product image
        let imageProduct = document.getElementsByClassName("item__img");
        let imageProductContent = "<img src='"+productDetail.imageUrl+"' alt='"+productDetail.altTxt+"'>"
        imageProduct[0].innerHTML += imageProductContent;
        // Command to define product name
        let nameProduct = document.getElementById("title");
        let nameProductContent = productDetail.name;
        nameProduct.innerHTML +=nameProductContent;
        // Command to define product price
        let priceProduct = document.getElementById("price");
        let priceProductContent = productDetail.price;
        priceProduct.innerHTML +=priceProductContent;
        // Command to define product description
        let descriptionProduct = document.getElementById("description");
        let descriptionProductContent = productDetail.description;
        descriptionProduct.innerHTML +=descriptionProductContent;
        // Command to define color options
        let colorProduct = document.getElementById("colors");
        productDetail.colors.forEach(function(item,index,array){
            let colorProductContent = "<option value='"+item+"'>"+item+"</option>";
            colorProduct.innerHTML +=colorProductContent;
        });
    })
});
