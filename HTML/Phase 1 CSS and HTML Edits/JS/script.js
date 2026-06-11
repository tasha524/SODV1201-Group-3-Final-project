
const workspaces = [
  {
    id: 1,
    neighborhood: "Downtown",
    price: 25,
    seats: 4,
    smoking: "no",
    address: "123 Main St",
    availability: "Available",
    ownerEmail: "owner1@email.com"
  },
  {
    id: 2,
    neighborhood: "Beltline",
    price: 15,
    seats: 2,
    smoking: "yes",
    address: "456 Center St",
    availability: "Available",
    ownerEmail: "owner2@email.com"
  },
  {
    id: 3,
    neighborhood: "NW",
    price: 40,
    seats: 6,
    smoking: "no",
    address: "789 NW Ave",
    availability: "Busy",
    ownerEmail: "owner3@email.com"
  }
];

function search() {
  const location = document.getElementById("location").value.toLowerCase().trim();
  const maxPrice = document.getElementById("maxPrice").value;
  const minSeats = document.getElementById("minSeats").value;
  const smoking = document.getElementById("smoking").value;

  const filtered = workspaces.filter(ws => {
    return (
      (location === "" || ws.neighborhood.toLowerCase().includes(location)) &&
      (maxPrice === "" || ws.price <= Number(maxPrice)) &&
      (minSeats === "" || ws.seats >= Number(minSeats)) &&
      (smoking === "" || ws.smoking === smoking)
    );
  });

  console.log(filtered);

  displayResults(filtered);
}

function displayResults(list) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  if (list.length === 0) {
    resultsDiv.innerHTML = "<p>No results found 😭</p>";
    return;
  }

  list.forEach(ws => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>📍 ${ws.neighborhood}</h3>
      <p>💺 ${ws.seats} seats</p>
      <p>💲 $${ws.price}</p>
      <button onclick="showDetails(${ws.id})">View Details</button>
    `;

    resultsDiv.appendChild(card);
  });
}

function showDetails(id) {
  const ws = workspaces.find(w => w.id === id);

  const detailsDiv = document.getElementById("details");

  detailsDiv.innerHTML = `
    <h2>Workspace Details</h2>
    <p><strong>Address:</strong> ${ws.address}</p>
    <p><strong>Neighborhood:</strong> ${ws.neighborhood}</p>
    <p><strong>Seats:</strong> ${ws.seats}</p>
    <p><strong>Price:</strong> $${ws.price}</p>
    <p><strong>Smoking:</strong> ${ws.smoking}</p>
    <p><strong>Availability:</strong> ${ws.availability}</p>
    <p><strong>Contact:</strong> ${ws.ownerEmail}</p>
  `;
}