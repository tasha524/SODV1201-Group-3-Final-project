let loggedUser =
JSON.parse(
    localStorage.getItem("loggedUser")
);

// Properties

let properties = [
{
    id: 1,
    ownerId: 1,
    propertyName: "Downtown Tower",
    city: "Calgary"
},
{
    id: 2,
    ownerId: 1,
    propertyName: "Tech Hub",
    city: "Airdrie"
},
{
    id: 3,
    ownerId: 2,
    propertyName: "Business Center",
    city: "Edmonton"
}
];

// Workspaces

let workspaces = [
{
    id: 1,
    propertyId: 1,
    workspaceName: "Desk A"
},
{
    id: 2,
    propertyId: 1,
    workspaceName: "Meeting Room"
},
{
    id: 3,
    propertyId: 2,
    workspaceName: "Private Office"
},
{
    id: 4,
    propertyId: 3,
    workspaceName: "Shared Desk"
}
];

// PAGE LOAD

window.onload = function(){

    if(loggedUser.role === "owner"){

        let ownerProperties =
            properties.filter(
                p => p.ownerId ==
                loggedUser.id
            );

        displayProperties(
            ownerProperties
        );
    }
    else{

        displayProperties(
            properties
        );
    }
};

// DISPLAY

function displayProperties(list){

    let output = "";

    list.forEach(property => {

        output += `
        <div>

            <h3>
                ${property.propertyName}
            </h3>

            <p>
                City:
                ${property.city}
            </p>
        `;

        // Display workspaces

        let propertyWorkspaces =
            workspaces.filter(
                w =>
                w.propertyId ==
                property.id
            );

        output += "<ul>";

        propertyWorkspaces.forEach(
            workspace => {

            output += `
            <li>
                ${workspace.workspaceName}
            </li>
            `;
        });

        output += "</ul>";

        // OWNER CONTROLS

        if(loggedUser.role ===
            "owner"){

            output += `
            <button
            onclick=
            "updateProperty(${property.id})">
                Update
            </button>

            <button
            onclick=
            "deleteProperty(${property.id})">
                Delete
            </button>
            `;
        }

        output += `
        <hr>
        </div>
        `;
    });

    document.getElementById(
        "results"
    ).innerHTML = output;
}

// SEARCH

function searchProperties(){

    let searchText =
        document.getElementById(
            "searchBox"
        ).value.toLowerCase();

    let filtered =
        properties.filter(
            property =>
            property.propertyName
            .toLowerCase()
            .includes(searchText)
        );

    displayProperties(filtered);
}

// SORT

function sortProperties(){

    let sorted =
        [...properties];

    let sortBy =
        document.getElementById(
            "sortSelect"
        ).value;

    if(sortBy === "name"){

        sorted.sort((a,b)=>
            a.propertyName
            .localeCompare(
                b.propertyName
            )
        );
    }

    if(sortBy === "city"){

        sorted.sort((a,b)=>
            a.city.localeCompare(
                b.city
            )
        );
    }

    displayProperties(sorted);
}

// UPDATE

function updateProperty(id){

    let property =
        properties.find(
            p => p.id == id
        );

    let newName =
        prompt(
            "Enter new property name:"
        );

    if(newName){

        property.propertyName =
            newName;

        displayProperties(
            properties
        );
    }
}

// DELETE

function deleteProperty(id){

    properties =
        properties.filter(
            p => p.id != id
        );

    displayProperties(
        properties
    );
}
