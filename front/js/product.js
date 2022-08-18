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

    
    const parametreUrl = new URLSearchParams(window.location.search);
    var saveId = parametreUrl.get('id');

   
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
