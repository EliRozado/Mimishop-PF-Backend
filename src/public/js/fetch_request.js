// helpers for below functionalities
const cartIcon = document.getElementById("cart")
const profile = document.getElementById("profile")
const productIDCarrier = document.getElementById("productID");
const premiumFormButton = document.getElementById("premiumFormButton");
const uploadProgress = document.getElementById("uploadProgress"); // progress bar container box
const progressbar = document.getElementById("progressbar"); // doc upload progress bar
const uploadSuccess = document.getElementById("uploadSuccess"); // upload successful box
const cart_total = document.getElementById('cart_total');
const cart_body = document.getElementById('cart_body')

// checks if the documents are correctly linked
console.log('connected!')

// --- Session functions

function loginFetch(e){
    if(e.preventDefault) e.preventDefault();

    const data = {};

    new FormData(login).forEach( (value, key) => data[key] = value)
    
    fetch('/session/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then( async response => {
        const result = await response.json()

        console.log(result)
        if(response.status != 200){
            Swal.fire({
                title: result.error,
                text: result.message
            })
        }else{
            window.location.replace("/products")
        }
    })
}

function registerFetch(e){
    if(e.preventDefault) e.preventDefault();

    const data = {};

    new FormData(register).forEach( (value, key) => data[key] = value)
    
    fetch('/session/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then( async response => {
        const result = await response.json()

        console.log(result)
        if(response.status != 201){
            Swal.fire({
                title: result.error,
                text: result.message
            })
        }else{
            window.location.replace("/registerSuccess")
        }
    })
}


// --- Premium Functions ------------------------------------------- 
function uploadDocsFetch(e){
    if(e.preventDefault) e.preventDefault();

    const id = document.getElementById('id_doc');
    const address = document.getElementById("address_doc");
    const status = document.getElementById("status_doc");
    const data = new FormData();

    data.append('id', id.files[0], id.files[0].name);
    data.append('address', address.files[0], id.files[0].name);
    data.append('status', status.files[0], id.files[0].name);

    const link = profile.href.split("/");
    const user = link.slice(-1);

    premiumFormButton.classList.add('d-none')
    uploadProgress.classList.remove('d-none')

    fetch(`/api/user/${user}/documents`, {
        method: 'POST',
        body: data
    }).then( async response => {
        const result = response.json()
        if(response.status != 201){
            Swal.fire({
                title: result.error,
                text: result.message
            })           
        }else{
            uploadProgress.classList.add('d-none')
            uploadSuccess.classList.remove('d-none')

            Swal.fire({
                title: 'Upload successful',
                text: 'Files were uploaded to the server, click OK to continue'
            })
        }
    })
}

function becomePremiumFetch(e){
    const link = profile.href.split("/");
    const user = link.slice(-1);

    fetch(`/api/user/premium/${user}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then( async response => {
        const result = response.json()
        console.log(response, result)
        if(response.status != 201){
            Swal.fire({
                title: result.error,
                text: result.message
            })           
        }else{
            becomePremium.classList.add('disabled');
            Swal.fire({
                title: 'Upgraded to premium!',
                text: 'Your user has been upgraded to premium, please logout and log back in to apply the change.'
            })
        }
    })
}


// --- Product Functions ------------------------------------------- 

// why won't it use the picture
function newProductFetch(e){
    if(e.preventDefault) e.preventDefault();
    let fileInput = document.querySelector(('input[type="file"]'))
    let count = fileInput.files[0];

    console.log(count)

    const data = new FormData(addProduct);    
    console.log(data)

    for(let x = 0; x < count; x++){
        data.append("thumbnails[]", fileInput.files[0], fileInput.files[0].name)
    }

    console.log(data)
    fetch(`/api/products`, {
        method: 'POST',
        body: data
    }).then( async response => {
        const result = await response.json()

        console.log(result)
        if(response.status != 200){
            Swal.fire({
                title: result.error,
                text: result.message
            })
        }else{
            Swal.fire({
                title: 'Product created',
                text: 'New product was added to the database.'
            })
            window.setTimeout(function(){
                window.location.replace("/products")
            }, 3000);
        }
    })
}

function editProductFetch(e){
    if(e.preventDefault) e.preventDefault();
    let id = productIDCarrier.getAttribute("pid");

    const data = {};

    new FormData(editProduct).forEach( (value, key) => data[key] = value)
    
    fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then( async response => {
        const result = await response.json()

        if(response.status != 200){
            Swal.fire({
                title: result.error,
                text: result.message
            })
        }else{
            Swal.fire({
                title: 'Edit successful',
                text: 'Product information was edited'
            })
            window.setTimeout(function(){
                window.location.replace("/products")
            }, 3000);
        }
    })
}

function addProductToCartFetch(e){
    if(e.preventDefault) e.preventDefault();
    let id = e.target.getAttribute("pid");
    let cart = cartIcon.getAttribute("cid");

    const data = [{product: id}];
    
    fetch(`/api/cart/${cart}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then( async response => {
        const result = await response.json()

        if(result.status != "SUCCESSFUL"){
            Swal.fire({
                title: result.error,
                text: result.message
            })
        }else{
            Toastify({
                text: "Product added to cart",
                duration: 3000
            }).showToast();
        }
    })
}

function deleteProductFetch(e){
    if(e.preventDefault) e.preventDefault();
    let id = e.target.getAttribute("pid");

    fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then( async response => {
        const result = await response.json()

        if(response.status != 200){
            Swal.fire({
                title: result.error,
                text: result.message
            })
        }else{
            Swal.fire({
                title: result.status,
                text: result.message
            })
            window.setTimeout(function(){
                window.location.replace("/products")
            }, 2000);
        }
    })
} 

// --- Cart Functions ------------------------------------------- 
function deleteProductFromCartFetch(e){
    const website = location.href.split("/");
    const cid = website.slice(-1);
    const pid = e.target.getAttribute("pid")
    const p_line = document.querySelector('.line-'+pid);
    const p_qty = document.querySelector('.qty-'+pid).innerHTML;
    const p_price = document.querySelector('.price-'+pid).innerHTML;

    let total_calc = cart_total.innerHTML;

    fetch(`/api/cart/${cid}/product/${pid}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then( async response => {
        const result = await response.json()
        if(response.status != 200){
            Swal.fire({
                title: result.error,
                text: result.message
            })
        }else{
            total_calc = total_calc - p_qty*p_price;
            cart_total.innerHTML = total_calc;
            p_line.remove();

            Swal.fire({
                title: 'Product removed from cart',
                text: 'The product you selected was removed from the cart'
            })
        }
    })

}

function addQuantityFetch(e){
    // *- catch ids
    const website = location.href.split("/");
    const cid = website.slice(-1);
    const pid = e.target.getAttribute("pid")
    // *- Items to modify
    const p_qty = document.querySelector('.qty-'+pid);
    const p_price = parseInt(document.querySelector('.price-'+pid).innerHTML);
    //*- Values
    let total = parseInt(cart_total.innerHTML);
    let new_qty = parseInt(p_qty.innerHTML) +1;

    const add = {quantity: 1}

    fetch(`/api/cart/${cid}/product/${pid}`, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(add)
    }).then( async response => {
        const result = await response.json()
        if(response.status != 200){
            Swal.fire({
                title: result.error,
                text: result.message
            })
        }else{
            let new_total = total + p_price;

            p_qty.innerHTML = new_qty;
            cart_total.innerHTML = new_total;

            Toastify({
                text: "Added more product quantity to the cart",
                duration: 3000
            }).showToast();
        }
    })
}

function minusQuantityFetch(e){
    // *- catch ids
    const website = location.href.split("/");
    const cid = website.slice(-1);
    const pid = e.target.getAttribute("pid")
    // *- Items to modify
    const p_qty = document.querySelector('.qty-'+pid);
    const p_price = parseInt(document.querySelector('.price-'+pid).innerHTML);
    //*- Values
    let total = parseInt(cart_total.innerHTML);
    let new_qty = parseInt(p_qty.innerHTML) -1;

    const subtract = {quantity: -1}

    // * -- Now if new_qty = 0, delete product from the cart.
    if(new_qty <= 0){
        deleteProductFromCartFetch(e)
    }else{
        fetch(`/api/cart/${cid}/product/${pid}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(subtract)
        }).then( async response => {
            const result = await response.json()
            if(response.status != 200){
                Swal.fire({
                    title: result.error,
                    text: result.message
                })
            }else{
                let new_total = total - p_price;
    
                p_qty.innerHTML = new_qty;
                cart_total.innerHTML = new_total;
    
                Toastify({
                    text: "Subtracted quantity of the product from the cart",
                    duration: 3000
                }).showToast();
            }
        })
    }
}

function emptyCartFetch(){
    const website = location.href.split("/");
    const id = website.slice(-1);

    fetch(`/api/cart/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then( async response => {
        const result = await response.json()
        if(response.status != 200){
            Swal.fire({
                title: result.error,
                text: result.message
            })
        }else{
            cart_body.innerHTML = '';

            cart_total.innerHTML = '0';
            Swal.fire({
                title: 'Cart emptied',
                text: 'All the products were deleted from the cart'
            })
        }
    })
}

function purchaseFetch(e){
    const website = location.href.split("/");
    const cid = website.slice(-1);

    fetch(`/api/cart/${cid}/purchase`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(async response => {
        const result = await response.json()
        console.log(result)
        if(response.status != 200){
            Swal.fire({
                title: result.error,
                text: result.message
            })
        }else if(result.status == "SUCCESSFUL"){
            Swal.fire({
                title: 'Purchase processed',
                text: `Your purchase has been successfully processed! \n \n Ticket: ${result.ticket.code} \n Purchase total: ${result.ticket.amount} `
            })
            cart_body.innerHTML = ''
            cart_total.innerHTML = 0
        }else if(result.status == "UNSUCCESSFUL"){
            Swal.fire({
                title: 'Purchase could not be processed',
                text: 'There is not enough stock for the items that are currently in the cart, please try again another time or contact the sellers if you are interested in purchasing!'
            })
        }else{
            Swal.fire({
                title: 'Purchase partly processed',
                text: `A couple of products in the cart could not bre processed due to a lack of stock, please try again another time or contact the sellers if you are interested in purchasing! \n \n Ticket: ${result.ticket.code} \n Total: ${result.ticket.amount}`
            })
            window.setTimeout(function(){
                location.reload()
            }, 3000);
        } 
    })
}

function cartActions(e){
    // Class list of the event buttons needed: addQty, minusQty, delete, empty, purchase
    const buttonClasses = e.target.classList
    if(buttonClasses.contains('delete')){
        deleteProductFromCartFetch(e)
    }

    if(buttonClasses.contains('addQty')){
        addQuantityFetch(e)
    }

    if(buttonClasses.contains('minusQty')){
        minusQuantityFetch(e)
    }

    if(buttonClasses.contains('empty')){
        return emptyCartFetch()
    }

    if(buttonClasses.contains('purchase')){
        purchaseFetch(e)
    }
    
    return false
}


/*
function deleteFromCart(e){
    if(e.preventDefault) e.preventDefault();
    let id = e.target.getAttribute("pid");
    let cart = cartIcon.getAttribute("cid");

    console.log({id, cart})
    
    /*fetch(`/api/cart/${cart}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then( async response => {
        const result = await response.json()

        console.log(result)
        if(result.status != "SUCCESSFUL"){
            Swal.fire({
                title: result.error,
                text: result.message
            })
        }else{
            Toastify({
                text: "Product added to cart",
                duration: 3000
            }).showToast();
        }
    })
}*/

