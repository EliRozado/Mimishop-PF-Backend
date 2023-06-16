const login = document.getElementById("login");
const register = document.getElementById("register");
const addToCartButton = document.getElementById("addToCart");
const deleteProd = document.getElementById("deleteProduct");
const addProduct = document.getElementById("addProduct");
const editProduct = document.getElementById("editProduct");
const premiumDocumentsUpload = document.getElementById("premiumDocumentsUpload"); // document upload form
const becomePremium = document.getElementById("becomePremium") // action to become premium
const cartWrapper = document.getElementById("cartWrapper")

// * --- Fetch calls for actions in the app
login && login.addEventListener('submit',loginFetch);
register && register.addEventListener('submit', registerFetch);
addToCartButton && addToCartButton.addEventListener('click', addProductToCartFetch);
deleteProd && deleteProd.addEventListener('click', deleteProductFetch);
addProduct && addProduct.addEventListener('submit', newProductFetch);
editProduct && editProduct.addEventListener('submit', editProductFetch);
premiumDocumentsUpload && premiumDocumentsUpload.addEventListener('submit', uploadDocsFetch);
becomePremium && becomePremium.addEventListener('click', becomePremiumFetch)
cartWrapper && cartWrapper.addEventListener('click', cartActions)

function lettersValidate(key) {
    var keycode = (key.which) ? key.which : key.keyCode;
    console.log(keycode);

    if (keycode == 32 || (keycode > 64 && keycode < 91) || (keycode > 96 && keycode < 123) )  
    {     
        return true;    
    }
    else
    {
        return false;
    }
}

async function nextPage(obj){
    let params = new URLSearchParams(window.location.search);
    const activePage = parseInt(document.getElementById('page').innerHTML) || 1;

    params.set('page', activePage+1)

    window.location.href = `/products?${params.toString()}`
}

async function prevPage(obj){
    let params = new URLSearchParams(window.location.search);
    const activePage = parseInt(document.getElementById('page').innerHTML) || 1;

    params.set('page', activePage-1)

    window.location.href = `/products?${params.toString()}`
}