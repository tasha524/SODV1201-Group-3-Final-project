const propertyList = [];



document.getElementById("property").addEventListener("submit", function(event) {
    event.preventDefault(); // Stop page reload

    // 1. Get the values
    const address = document.getElementById("address").value;
    const neighborhood = Number(document.getElementById("neighborhood").value);
    const sqft = Number(document.getElementById("sqft").value);

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

    document.getElementById("property").reset();
});