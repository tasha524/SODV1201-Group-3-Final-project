const workspaceList = [];

document.getElementById("workspace").addEventListener("submit", function(event) {
    event.preventDefault(); 

    // 1. Get the values
    const properties = Number(document.getElementById("propertySearch").value);
    const workspaceType = document.getElementById('type').value; // Fixed typo
    const seats = Number(document.getElementById("seats").value);
    const smokeChecker = document.getElementById("smoke").checked;
    const smoke = smokeChecker ? "Yes" : "No";
    const date = document.getElementById("date").value;
    const leaseTerm = Number(document.getElementById("term").value);
    const dwm = document.getElementById("dwm").value;

    // 2. Validation 
    if (properties === "" || workspaceType === "" || !seats || !date || leaseTerm === "" || dwm === "") {
        alert("All fields are required!");
        return; // Stop right here
    }

    // 3. Create the workspace object
    const workspace = {
        workspaceType: workspaceType,
        seats: seats,
        smoke: smoke,
        date: date,
        leaseTerm: leaseTerm,
        dwm: dwm,
    };

    // 4. Push to the array
    workspaceList.push(workspace);
    console.log("Workspace List:", workspaceList);

    // 5. Display on page
    let space = document.createElement("div");
    space.className = "space";
    space.innerHTML = 
        "<h3>" + workspace.workspaceType + "</h3>" + 
        "<p>Seats: " + workspace.seats + "</p>" +
        "<p>Smoke: " + workspace.smoke + "</p>" +
        "<p>Date: " + workspace.date + "</p>" +
        "<p>Lease: " + workspace.leaseTerm + " " + workspace.dwm + "</p>";
    document.getElementById("workspaces").appendChild(space);

    // 6. Send to database - MOVED INSIDE the submit event!
    fetch("http://localhost:3001/Workspaces", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            propertySearch: properties,   
            type: workspaceType,           
            seats: seats,
            smoke: smoke,
            date: date,
            term: leaseTerm,               
            dwm: dwm                       
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || "Server error");
            });
        }
        return response.json();
    })
    .then(data => {
        console.log("Server response:", data);
        alert("Workspace added successfully! ID: " + data.WorkspaceID);
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Failed to save workspace: " + error.message);
    });

    // 7. Reset the form
    document.getElementById("workspace").reset();
});
