const propertyList = [];



document.getElementById("property").addEventListener("submit", function(event) {
    event.preventDefault(); // Stop page reload

    // 1. Get the values
    const address = document.getElementById("address").value;
    const neighborhood = (document.getElementById("neighborhood").value);
    const sqft = Number(document.getElementById("sqft").value);
    const message = document.getElementById("message");
    const garageChecked = document.getElementById("garage").checked;
    const transitChecked = document.getElementById("transit").checked;

    const garage = garageChecked ? "Yes" : "No";
    const transit = transitChecked ? "Yes" : "No";

    
    // 2. Simple Validation (Check if any field is empty)
    if (address === "" || neighborhood === "" || !sqft) {
        alert("All fields are required!");
        return; // Stop right here
    }


    // 3. Create the property object
    const property = { 
        address: address, 
        neighborhood: neighborhood, 
        sqft: sqft, 
        garage: garage, 
        transit: transit 
    };

    // 4. Push to the array
    propertyList.push(property);

    // See it working in the console
    console.log(propertyList);

   
    fetch("http://localhost:3001/Properties", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(property)
    })
        .then(response => {
            if (!response.ok) {
                //if the reponse was not good then throw an error
                return response.json().then(err => { throw new Error(err.error) });
            }
            //else return the respone
            return response.json();
        })
        .then(data => {
            let propertyId = "Created successfully";

            if (data && data.propertyId) {
                propertyId = data.propertyId;
            }
            message.style.color = "green";
            message.innerText = "Success! Property created. Status: " + propertyId;

            document.getElementById("property").reset();
        })
        .catch(error => {
            // if any errors are found
            console.error("WorkSpace Error:", error);
            message.style.color = "red";
            message.innerText = "Server Error: " + error.message;
        });

});

