const usersList = [];


document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Stop page reload

    // 1. Get the values
    const name = document.getElementById("fullName").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const role = document.getElementById("role").value;

    // 2. Simple Validation (Check if any field is empty)
    if (name === "" || phone === "" || email === "" || role === "") {
        alert("All fields are required!");
        return; // Stop right here
    }

    // 3. Create the person object
    const person = { name, phone, email, role };

    // 4. Push to the array
    usersList.push(person);

    // See it working in the console
    console.log(usersList);

    document.getElementById("signupForm").reset();
});