 const person = { 
        firstName: "Mark", 
        lastName: "Green", 
        phone: "1234567890", 
        email: "DataTest@gmail.com", 
        password: "PassTest@123",
        role: "Co-Worker"
       
    };

const express = require("express");
const cors = require("cors"); 
const sqlite3 = require("sqlite3").verbose();
const jwt = require('jsonwebtoken');
 
const app = express();
const PORT = 3001;
 

app.use(cors()); 
app.use(express.json());
 
const db = new sqlite3.Database("./FinalDataBase.db", (err) => {
    if(err){ console.log(err.message);}
    else{console.log("Connect to SQLite Database")}
})
 
db.run(`CREATE TABLE IF NOT EXISTS UserAccount (

	UserID							INTEGER PRIMARY KEY AUTOINCREMENT,

	FirstName						VARCHAR(50)			NOT NULL,

	LastName						VARCHAR(50)			NOT NULL,

	Phone							VARCHAR(50)			NOT NULL,

	Email							VARCHAR(100)		NOT NULL,

    Role                            VARCHAR(100)		NOT NULL,

    Password                        VARCHAR(50)			NOT NULL

)`)

db.run(`CREATE TABLE IF NOT EXISTS Properties (

    PropertyID      INTEGER PRIMARY KEY AUTOINCREMENT,
	
    Address         VARCHAR(255)    NOT NULL,
	
    Neighborhood    INTEGER         NOT NULL,
	
    Sqft            INTEGER         NOT NULL,
	
    Garage          VARCHAR(10)     NOT NULL,
	
    Transit         VARCHAR(10)     NOT NULL,
	
    CreatedAt       DATETIME        DEFAULT CURRENT_TIMESTAMP
)`);

// GET all properties
app.get("/properties", (req, res) => {
    db.all("SELECT * FROM Properties ORDER BY CreatedAt DESC", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// POST a new property
app.post("/properties", (req, res) => {
    const { address, neighborhood, sqft, garage, transit } = req.body;
    
    // Validate required fields
    if (!address || !neighborhood || !sqft) {
        return res.status(400).json({ 
            error: "Address, neighborhood, and sqft are required!" 
        });
    }

    db.run(`
        INSERT INTO Properties (address, neighborhood, sqft, garage, transit)
        VALUES (?, ?, ?, ?, ?)
    `, [address, neighborhood, sqft, garage, transit], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        res.json({
            message: "Property added successfully!",
            propertyID: this.lastID
        });
    });
});

// DELETE a property
app.delete("/properties/:id", (req, res) => {
    const propertyId = req.params.id;

    db.run("DELETE FROM Properties WHERE PropertyID = ?", [propertyId], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: "Property not found" });
        }
        res.json({ message: `Property with ID ${propertyId} deleted successfully.` });
    });
});

// UPDATE a property 
app.put("/properties/:id", (req, res) => {
    const propertyId = req.params.id;
    const { address, neighborhood, sqft, garage, transit } = req.body;

    db.run(`
        UPDATE Properties 
        SET address = ?, neighborhood = ?, sqft = ?, garage = ?, transit = ?
        WHERE PropertyID = ?
    `, [address, neighborhood, sqft, garage, transit, propertyId], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: "Property not found" });
        }
        res.json({ message: `Property with ID ${propertyId} updated successfully.` });
    });
});
 
    app.get("/", (req, res) => {
        res.send("Data Base Test");
    })

    app.get("/Data", (req, res) => {
 
    db.all("SELECT * FROM UserAccount", [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        res.json(rows);
    });
});
 
app.post("/Data", (req, res) => {
    const {firstName, lastName, phone, email, password, role} = req.body;
   
    db.run(`
        INSERT INTO UserAccount
        (firstName, lastName, phone, email, password, role)
        VALUES (?, ?, ?, ?, ?, ?)`, [firstName, lastName, phone, email, password, role], function(err){
            if(err){
                return res.status(500).json({error: err.message})
            }
       
        res.json({
            message: "Person Created",
            UserID: this.lastID
        })
    })
})

app.delete("/data/:id", (req, res) => {
    const userId = req.params.id;

    db.run("DELETE FROM UserAccount WHERE UserID = ?", [userId], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // this.changes tells us how many rows were actually deleted
        if (this.changes === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: `User with ID ${userId} deleted successfully.` });
    });
});
 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// Add Workspace table
db.run(`CREATE TABLE IF NOT EXISTS Workspaces (
    WorkspaceID     INTEGER PRIMARY KEY AUTOINCREMENT,
    PropertyID      INTEGER,
    WorkspaceType   VARCHAR(100) NOT NULL,
    Seats           INTEGER NOT NULL,
    Smoke           VARCHAR(10) NOT NULL,
    DateAvailable   DATE NOT NULL,
    LeaseTerm       VARCHAR(50) NOT NULL,
    DWM             VARCHAR(50) NOT NULL,
    CreatedAt       DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (PropertyID) REFERENCES Properties(PropertyID)
)`);

// ============ WORKSPACE ENDPOINTS ============

// GET all workspaces
app.get("/workspaces", (req, res) => {
    db.all(`
        SELECT w.*, p.Address as PropertyAddress 
        FROM Workspaces w
        LEFT JOIN Properties p ON w.PropertyID = p.PropertyID
        ORDER BY w.CreatedAt DESC
    `, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// GET workspaces by property ID
app.get("/workspaces/property/:propertyId", (req, res) => {
    const propertyId = req.params.propertyId;
    
    db.all(`
        SELECT * FROM Workspaces 
        WHERE PropertyID = ?
        ORDER BY CreatedAt DESC
    `, [propertyId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// POST a new workspace
app.post("/workspaces", (req, res) => {
    const { propertyId, workspaceType, seats, smoke, date, leaseTerm, dwm } = req.body;
    
    // Validate required fields
    if (!workspaceType || !seats || !date || !leaseTerm || !dwm) {
        return res.status(400).json({ 
            error: "All fields are required!" 
        });
    }

    db.run(`
        INSERT INTO Workspaces 
        (PropertyID, WorkspaceType, Seats, Smoke, DateAvailable, LeaseTerm, DWM)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [propertyId || null, workspaceType, seats, smoke, date, leaseTerm, dwm], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        res.json({
            message: "Workspace added successfully!",
            workspaceID: this.lastID
        });
    });
});

// DELETE a workspace
app.delete("/workspaces/:id", (req, res) => {
    const workspaceId = req.params.id;

    db.run("DELETE FROM Workspaces WHERE WorkspaceID = ?", [workspaceId], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: "Workspace not found" });
        }
        res.json({ message: `Workspace with ID ${workspaceId} deleted successfully.` });
    });
});

// UPDATE a workspace
app.put("/workspaces/:id", (req, res) => {
    const workspaceId = req.params.id;
    const { propertyId, workspaceType, seats, smoke, date, leaseTerm, dwm } = req.body;

    db.run(`
        UPDATE Workspaces 
        SET PropertyID = ?, WorkspaceType = ?, Seats = ?, Smoke = ?, 
            DateAvailable = ?, LeaseTerm = ?, DWM = ?
        WHERE WorkspaceID = ?
    `, [propertyId, workspaceType, seats, smoke, date, leaseTerm, dwm, workspaceId], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: "Workspace not found" });
        }
        res.json({ message: `Workspace with ID ${workspaceId} updated successfully.` });
    });
});
