// Safely parse or assign an empty object if no user is found
let loggedUser = JSON.parse(localStorage.getItem("loggedUser")) || {};

// Properties
let properties = [
    { id: 1, ownerId: 1, propertyName: "Downtown Tower", city: "Calgary" },
    { id: 2, ownerId: 1, propertyName: "Tech Hub", city: "Airdrie" },
    { id: 3, ownerId: 2, propertyName: "Business Center", city: "Edmonton" }
];

// Workspaces
let workspaces = [
    { id: 1, propertyId: 1, workspaceName: "Desk A" },
    { id: 2, propertyId: 1, workspaceName: "Meeting Room" },
    { id: 3, propertyId: 2, workspaceName: "Private Office" },
    { id: 4, propertyId: 3, workspaceName: "Shared Desk" }
];

// PAGE LOAD
window.onload = function() {
    // Added safety check: ensures loggedUser exists and has an id
    if (loggedUser && loggedUser.role === "owner") {
        let ownerProperties = properties.filter(
            p => p.ownerId == loggedUser.id
        );
        displayProperties(ownerProperties);
    } else {
        displayProperties(properties);
    }
};

// DISPLAY
function displayProperties(list) {
    let output = "";

    list.forEach(property => {
        output += `
        <div>
            <h3>${property.propertyName}</h3>
            <p>City: ${property.city}</p>
        `;

        // Display workspaces
        let propertyWorkspaces = workspaces.filter(
            w => w.propertyId == property.id
        );

        output += "<ul>";
        propertyWorkspaces.forEach(workspace => {
            output += `<li>${workspace.workspaceName}</li>`;
        });
        output += "</ul>";

        // OWNER CONTROLS - Added optional chaining security check
        if (loggedUser && loggedUser.role === "owner") {
            output += `
            <button onclick="updateProperty(${property.id})">Update</button>
            <button onclick="deleteProperty(${property.id})">Delete</button>
            `;
        }

        output += `
        <hr>
        </div>
        `;
    });

    document.getElementById("results").innerHTML = output;
}

// SEARCH
function searchProperties() {
    let searchText = document.getElementById("searchBox").value.toLowerCase();

    // Context filter: Also respects whether an owner should only see their own items while searching
    let baseProperties = (loggedUser && loggedUser.role === "owner") 
        ? properties.filter(p => p.ownerId == loggedUser.id) 
        : properties;

    let filtered = baseProperties.filter(property =>
        property.propertyName.toLowerCase().includes(searchText)
    );

    displayProperties(filtered);
}

// SORT
function sortProperties() {
    let sortBy = document.getElementById("sortSelect").value;
    
    // Dynamically checks current view context instead of resorting global array out-of-context
    let baseProperties = (loggedUser && loggedUser.role === "owner") 
        ? properties.filter(p => p.ownerId == loggedUser.id) 
        : properties;

    let sorted = [...baseProperties];

    if (sortBy === "name") {
        sorted.sort((a, b) => a.propertyName.localeCompare(b.propertyName));
    }

    if (sortBy === "city") {
        sorted.sort((a, b) => a.city.localeCompare(b.city));
    }

    displayProperties(sorted);
}

// UPDATE
function updateProperty(id) {
    let property = properties.find(p => p.id == id);
    if (!property) return;

    let newName = prompt("Enter new property name:", property.propertyName);

    if (newName && newName.trim() !== "") {
        property.propertyName = newName;
        
        // Re-filter and display contextually
        let baseProperties = (loggedUser.role === "owner") 
            ? properties.filter(p => p.ownerId == loggedUser.id) 
            : properties;
            
        displayProperties(baseProperties);
    }
}

// DELETE
function deleteProperty(id) {
    properties = properties.filter(p => p.id != id);

    let baseProperties = (loggedUser.role === "owner") 
        ? properties.filter(p => p.ownerId == loggedUser.id) 
        : properties;

    displayProperties(baseProperties);
}
