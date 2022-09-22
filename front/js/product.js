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
        let filterDecimal = /^[0-9]+$/;
        
        if(quantity.value >=100 || quantity.value < 0 || !quantity.value.match(filterDecimal)){
            alert("quantité non autorisée - choisissez un valeur entre 1 - 100")
            quantity.value = 1
        }
    },false)
//sets an alert when the user dont choose the quantity and/or color
    let button = document.getElementById("addToCart")
    button.addEventListener("click", function(event){
        colors = document.getElementById("colors")
        //verifies if quantity is equal 0
        if(quantity.value == ""|| quantity.value == 0){
            alert("chosissez une quantité")
        }
        else{//only executes when the quantity is different from zero
            //verifies if the color is selected
            if(colors.value == ""){
                alert ("choisissez une couleur")
            }
            else{//only executes when the user choose the color
        
                //Creates an array with cart information to be stored at local storage
                let currentCart = window.localStorage.getItem('detailsCart');
                // if the current cart is empty
                if(currentCart == null){
                    let detailsCart = {"collection":[{"id":saveId, "quantity":quantity.value, "colors":colors.value}]};
                    window.localStorage.setItem('detailsCart',JSON.stringify(detailsCart));
                    location.href = 'cart.html'
                }
                else{ // if there is any item on the cart, it will verify if the product has the same ID and color
                    // Load the cart on the variable cartContent
                    let cartContent = JSON.parse(currentCart);
                    // start flag variable to see if it finds it
                    let foundSameItem = 0;
                    let indexSameItem = -1;
                    let quantTotalCart = 0;
                    
                    // Go through all items comparing ID and COLOR to see if found
                    cartContent.collection.forEach(function(item,index,array){
                        if(item.id == saveId && item.colors == colors.value){
                            foundSameItem = 1;
                            indexSameItem = index;
                        }
                        quantTotalCart = quantTotalCart + parseInt(item.quantity);
                    });
                    
                    if ((quantTotalCart + parseInt(quantity.value)) <= 100){ //only executes when less than 100 items in the cart
                        // If it finds the same item (same color and id) only update the amount and saves on the localStore
                        if(foundSameItem == 1 && indexSameItem > -1){
                            cartContent.collection[indexSameItem].quantity = parseInt(cartContent.collection[indexSameItem].quantity) + parseInt(quantity.value);
                           window.localStorage.setItem('detailsCart', JSON.stringify(cartContent)); 
                           location.href = 'cart.html';
                        }
                        else{ // If it doesnt find, add the product as a new item on the cart
                            let currentProduct = {"id":saveId, "quantity":quantity.value, "colors":colors.value};
                            cartContent.collection.push(currentProduct)
                            window.localStorage.setItem('detailsCart', JSON.stringify(cartContent));
                            location.href = 'cart.html'
                        }
                    }
                    else {
                        alert ("quantité maxime 100 articles");
                    }
                }
            }
        }
    },false)

// update the html
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
