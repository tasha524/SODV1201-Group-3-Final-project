const usersList = [];

const message = document.getElementById("formMessage")

document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Stop page reload

    // 1. Get the values
    const fName = document.getElementById("firstName").value;
    const lName = document.getElementById("lastName").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const role = document.getElementById("role").value;
    const password= document.getElementById("password").value;

    // 2. Simple Validation (Check if any field is empty)
    if (fName === "" || lName ==="" ||phone === "" || email === "" || role === "" || password ==="") {
        message.innerText="Error! All feilds are required";
        return; // Stop right here
    }

     // Email Validation
    const emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValidation.test(email)) {
        message.innerText = "Please enter a valid email address.";
        return;
    }

    // Phone Validation 
    const phoneValadation = /^[0-9]{10}$/;
    if (!phoneValadation.test(phone)) {
        message.innerText = "Phone number must be exactly 10 digits.";
        return;
    }

    //Name valadation 
    const nameValidation = /\d/;

    if (nameValidation.test(fName)) {
    message.innerText = "Error! Name cannot contain numbers.";
    return; 
}

if (fName.length < 2 || fName.length > 13 ){
    message.innerText = "Error! First Name Must Be Between 2 - 13 characters ";
    return;
}

  if (nameValidation.test(lName)) {
    message.innerText = "Error! Name cannot contain numbers.";
    return; 
}

if (lName.length < 2 || lName.length > 13 ){
    message.innerText = "Error! Last Name Must Be Between 2 - 13 characters ";
    return;
}

//passward validation

// make sure password is minimum 8 characters
    if (password.length < 8) {
        message.innerText = "Error! Password must be at least 8 characters long.";
        return;
    }

    // look for spaces
    if (/\s/.test(password)) {
        message.innerText = "Error! Password cannot contain spaces.";
        return;
    }

    //one uppercase letter
    if (!/[A-Z]/.test(password)) {
        message.innerText = "Error! Password must contain at least one uppercase letter.";
        return;
    }
      //one lowercase letter 
    if (!/[a-z]/.test(password)) {
        message.innerText = "Error! Password must contain at least one lowercase letter.";
        return;
    }
//one digit
    if (!/\d/.test(password)) {
        message.innerText = "Error! Password must contain at least one number.";
        return;
    }

   
    // at least 1 special character
    if (!/[@#$%^&+=!]/.test(password)) {
        message.innerText = "Error! Password must contain at least one special character (@#$%^&+=!).";
        return;
    }
message.innerText = "From Validation sucessful!";

    // 3. Create the person object
    const person = { 
        firstName: fName, 
        lastName: lName, 
        phone: phone, 
        email: email, 
        password: password,
        role: role
       
    };

    // 4. Push to the array
    usersList.push(person);

    // See it working in the console
    console.log(usersList);

    document.getElementById("signupForm").reset();
});