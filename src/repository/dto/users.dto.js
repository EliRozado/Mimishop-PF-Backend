const getUsersDTO = (user) => ({
    id: user.id,
    name: user.first_name + ' ' + user.last_name,
    email: user.email,
    role: user.role
});

export const getUsersResDTO = (users) => {
    const data = users.map(user => getUsersDTO(user)) 
    return data;
}

export const userInformation = (user) => ({
        name: user.first_name + ' ' + user.last_name,
        email: user.email,
        age: user.age,
        role: user.role,
        id: user.id,
        documents: user.documents,
        cart: user.carts[0].cart
    }
)

export const userRegister = (user) => ({
    name: user.first_name + ' ' + user.last_name,
    email: user.email,
    age: user.age,
    role: user.role,
    id: user.id,
    documents: user.documents
}
)

export const userDTO = (user) => (
    {
        name : user.first_name + ' ' + user.last_name,
        role : user.role,
        cart : user.cart,
        id : user.user_id
    }
)