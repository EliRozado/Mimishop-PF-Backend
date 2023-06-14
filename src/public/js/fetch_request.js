const cartIcon = document.getElementById("cart")
const productIDCarrier = document.getElementById("productID")
console.log('connected!')

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

function catchClick(e){
    let id = e.target.getAttribute("pid");;
    console.log(id)
}

function deleteProductFetch(e){
    if(e.preventDefault) e.preventDefault();
    let id = e.target.getAttribute("pid");

    console.log({id, cart})
    
    fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
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
                title: result.status,
                text: result.message
            })

            window.setTimeout(function(){
                window.location.replace("/products")
            }, 5000);
        }
    })
}

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

//action="/api/products/{{product.id}}" method="PUT"