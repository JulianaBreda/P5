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
    
    // Selects the object "section" in the HTML page 
    var itemsSection = document.getElementById("items");

    fetch("http://localhost:3000/api/products")
    .then(function(response){return response.json()})
    .then(function(items){
        items.forEach(function(item,index,array){
            // Creates a new HTML line and dynamically fill values in "item" fields
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
    })
})
