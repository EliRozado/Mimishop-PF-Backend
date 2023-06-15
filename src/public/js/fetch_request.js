// helpers for below functionalities
const cartIcon = document.getElementById("cart")
const profile = document.getElementById("profile")
const productIDCarrier = document.getElementById("productID");
const premiumFormButton = document.getElementById("premiumFormButton");
const uploadProgress = document.getElementById("uploadProgress"); // progress bar container box
const progressbar = document.getElementById("progressbar"); // doc upload progress bar
const uploadSuccess = document.getElementById("uploadSuccess"); // upload successful box

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
    let count = fileInput.files.length;

    const data = new FormData(addProduct);    
    console.log(data)

    for(let x = 0; x < count; x++){
        data.append("files[]", fileInput.files[x], fileInput.files[x].name)
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

        console.log(result)
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

// --- Cart Functions ------------------------------------------- 

function addProductToCartFetch(e){
    if(e.preventDefault) e.preventDefault();
    let id = e.target.getAttribute("pid");
    let cart = cartIcon.getAttribute("cid");

    const data = [{product: id}];
    console.log({id, cart})
    
    fetch(`/api/cart/${cart}`, {
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
}


// -- test
function catchClick(e){
    let id = e.target.getAttribute("pid");;
    console.log(id)
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

