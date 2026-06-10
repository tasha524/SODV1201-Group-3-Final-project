// Sample users

let users = [
{
    id: 1,
    name: "John",
    email: "owner@test.com",
    password: "123",
    role: "owner"
},
{
    id: 2,
    name: "Sarah",
    email: "coworker@test.com",
    password: "123",
    role: "coworker"
}
];

function login() {

    let email =
        document.getElementById("email").value;

    let password =
        document.getElementById("password").value;

    let user = users.find(u =>
        u.email === email &&
        u.password === password
    );

    if(user){

        localStorage.setItem(
            "loggedUser",
            JSON.stringify(user)
        );

        window.location.href =
            "search.html";
    }
    else{
        alert("Invalid Login");
    }
}
