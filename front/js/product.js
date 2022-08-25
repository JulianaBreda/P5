var saveId = "";
var colors = "";
var quantity = "";
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

// sets an alert when the user choses <100 items
    quantity = document.getElementById("quantity")
    quantity.addEventListener("input",function(event){
        if(quantity.value >100){
            alert("quantité non autorisée")
            quantity.value = 1
        }
    },false)
//sets an alert when the user dont choose the quantity and/or color
    var button = document.getElementById("addToCart")
    button.addEventListener("click", function(event){
        colors = document.getElementById("colors")
        if(quantity.value == ""|| quantity.value == 0){
            alert("chosissez une quantité")
        }
        if(colors.value == ""){
            alert ("choisissez une couleur")
        }
//Creates an array with cart information to be stored at local storage
    var currentCart = window.localStorage.getItem('detailsCart');
    if(currentCart == null){
        var detailsCart = {"collection":[{"id":saveId, "quantity":quantity.value, "colors":colors.value}]};
        window.localStorage.setItem('detailsCart',JSON.stringify(detailsCart));
        location.href = 'cart.html'
    }
    else{
        var cartContent = JSON.parse(currentCart);
        var currentProduct = {"id":saveId, "quantity":quantity.value, "colors":colors.value};
        cartContent.collection.push(currentProduct)
        window.localStorage.setItem('detailsCart', JSON.stringify(cartContent));
        location.href = 'cart.html'
    }
    },false)

// INSERT COMMENT
    const parametreUrl = new URLSearchParams(window.location.search);
    saveId = parametreUrl.get('id');

   
    fetch("http://localhost:3000/api/products/"+saveId)
    .then(function(response){return response.json()})
    .then(function(item){
    
        var productDetail = item;
        // Command to define product image
        var imageProduct = document.getElementsByClassName("item__img");
        var imageProductContent = "<img src='"+productDetail.imageUrl+"' alt='"+productDetail.altTxt+"'>"
        imageProduct[0].innerHTML += imageProductContent;
        // Command to define product name
        var nameProduct = document.getElementById("title");
        var nameProductContent = productDetail.name;
        nameProduct.innerHTML +=nameProductContent;
        // Command to define product price
        var priceProduct = document.getElementById("price");
        var priceProductContent = productDetail.price;
        priceProduct.innerHTML +=priceProductContent;
        // Command to define product description
        var descriptionProduct = document.getElementById("description");
        var descriptionProductContent = productDetail.description;
        descriptionProduct.innerHTML +=descriptionProductContent;
        // Command to define color options
        var colorProduct = document.getElementById("colors");
        productDetail.colors.forEach(function(item,index,array){
            var colorProductContent = "<option value='"+item+"'>"+item+"</option>";
            colorProduct.innerHTML +=colorProductContent;
        });
    })
});
