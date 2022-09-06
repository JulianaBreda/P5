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
pageReady(function(){
    const parametreUrl = new URLSearchParams(window.location.search); //get Id from the browser address bar
    let orderId = parametreUrl.get('orderId'); 
    let orderIdHTML = document.getElementById("orderId"); //get the html element to add id number
    orderIdHTML.innerHTML = orderId; 
    window.localStorage.clear("detailsCart"); //clean the shopping cart
})