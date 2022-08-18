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

    // Creates the variable AJAX to fetch data asynchronously at the backend URL
    var ajax = new XMLHttpRequest();
    const parametreUrl = new URLSearchParams(window.location.search);
    var saveId = parametreUrl.get('id');

    // Inform the AJAX the backend adress to fetch the data, using the GET. command . Leave as "true" para que a chamada seja assíncrona
    ajax.open("GET","http://localhost:3000/api/products/"+saveId,true);
    
    // Sets the type of data o get captured by the AJAX. The backend sends it in JSON
    ajax.responseType = "json";
    
    // Creates a function on the "onload", the fucntion will only be executed when the ajax finish geting the data
    ajax.onload = function(ev){
        
        // Save the ajax answer in the variable called items
        var productDetail = ajax.response;
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
    }

    // Instruct the ajax to start conection to backend to fetch the data
    ajax.send();
});
