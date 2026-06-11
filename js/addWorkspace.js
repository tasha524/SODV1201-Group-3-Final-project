//import propertyList from './addProperty.js';

const workspaceList = [];


document.getElementById("workspace").addEventListener("submit", function(event) {
    event.preventDefault(); // Stop page reload

    // 1. Get the values
    const properties = document.getElementById("propertySearch").value;
    const worskpaceType = document.getElementById('type').value;
    const seats = Number(document.getElementById("seats").value);

    const smokeChecker = document.getElementById("smoke").checked;

    const smoke = smokeChecker ? "Yes" : "No";

    const date = document.getElementById("date").value;
    const leaseTerm = document.getElementById("term").value;
    const dwm = document.getElementById("dwm").value;

    
    // 2. Simple Validation (Check if any field is empty)
    if (properties === "" || worskpaceType === "" || !seats || !date || leaseTerm ==="" ||dwm === "") {
        alert("All fields are required!");
        return; // Stop right here
    }


    // 3. Create the property object
    const workspace = { 
        worskpaceType: worskpaceType, 
        seats: seats, 
        smoke: smoke, 
        date: date ,
        leaseTerm: leaseTerm ,
        dwm: dwm,
    };

    // 4. Push to the array
    workspaceList.push(workspace);

    // See it working in the console
    console.log(workspaceList);

    let space = document.createElement("div");
        space.className = "space";
        space.innerHTML = "<h3>" + workspace.worskpaceType + "</h3>" + 
        "<p>Seats: " + workspace.seats + "</p>" +
        "<p>Smoke: " + workspace.smoke + "</p>" +
        "<p>Date: " + workspace.date + "</p>" +
        "<p>Lease : " + workspace.leaseTerm + ", " + workspace.dwm + "</p>"
        document.getElementById("workspaces").appendChild(space);

    document.getElementById("workspace").reset();
});