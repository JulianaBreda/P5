//Handler - only starts a function when the page is fully loaded
// ->  parameter myFunction : a function that will be triggered only when the page is fully loaded
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
    
    // Selects the object "section" in the HTML page 
    var itemsSection = document.getElementById("items");

    // Inform the AJAX the backend adress to fetch the data, using the GET. command 
    ajax.open("GET","http://localhost:3000/api/products/",true);
    
    // Sets the type of data o get captured by the AJAX. The backend sends it in JSON
    ajax.responseType = "json";
    
    // Creates a fucntion on the "onload". This function will only be executed when the ajax complete data capture
    ajax.onload = function(ev){
        
        // Save the ajax answer in the variable called 'items'
        var items = ajax.response;

        // As the backend answer (JSON) is formated in Array, I used "forEach" to go through the elements/items
        // one by one. In this case I only used "item".
        items.forEach(function(item,index,array){
            
            // Creates a new HTML line and dynamically fill values in "item" fields, which is an
            // element captured by the ajax
            newItem="<a href='./product.html?id="+item._id+"'> \
                        <article> \
                            <img src='"+item.imageUrl+"' alt=\""+item.altTxt+"\"> \
                            <h3 class='productName'>"+item.name+"</h3> \
                            <p class='productDescription'>"+item.description+"</p>\
                        </article> \
                    </a>";
            
            // Dinamicly changes the object content "<section id='items'></section>" but always using "+=" to add to the existing content
            // and not replace the old content
            itemsSection.innerHTML += newItem;
        });
    }

    // Instruct the ajax to start conection to backend to fetch data
    ajax.send();
});
