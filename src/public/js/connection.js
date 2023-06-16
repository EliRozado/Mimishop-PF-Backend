const socket = io();

const user_table = document.getElementById('user_table');
const purge_button = document.getElementById('purge_button');

// ------- Socket
socket.on("connected", (data) => {
    console.log('connected with server')
})

socket.on("users", data => {
    let users = ''

    data.forEach((user) => {
        users = users + `<tr>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td> <button type="button" class="btn btn-dark change_role" uid="${user.id}" role="${user.role == 'premium' ? 'user' : 'premium'}">Change role</button> </td>
        <td><i class="bi bi-trash3-fill btn btn-danger delete_user" uid="${user.id}"></i></td>
    </tr>`
    })

    user_table.innerHTML = users;
});


// ------- admin functions
user_table.addEventListener('click', (e) => {
    const buttonClasses = e.target.classList

    if(buttonClasses.contains('delete_user')){
        const uid = e.target.getAttribute("uid")

        socket.emit('user_delete', {uid})

        Toastify({
            text: "User deleted",
            duration: 3000
        }).showToast();
    }

    if(buttonClasses.contains('change_role')){
        const uid = e.target.getAttribute("uid")
        const role = e.target.getAttribute("role")

        socket.emit('change_role', {uid, role})

        Toastify({
            text: "User role changed",
            duration: 3000
        }).showToast();
    }
})

purge_button.addEventListener('click', (e) => {
    console.log('purge time')

    socket.emit('purge_users')

    Swal.fire({
        title: 'Inactive users deleted',
        text: 'Users that were inactive for 2 days have been deleted, they will receive an email notification.'
    })
})