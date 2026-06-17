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
	
    Neighborhood    VARCHAR(100)    NOT NULL,
	
    Sqft            INTEGER         NOT NULL,
	
    Garage          VARCHAR(10)     NOT NULL,
	
    Transit         VARCHAR(10)     NOT NULL,
	
    CreatedAt       DATETIME        DEFAULT CURRENT_TIMESTAMP
)`);
 
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

// update user 

app.put("/Data/:id", (req, res) => {
    const userId = req.params.id; // Grabs the ID from the URL (e.g., /Data/1)
    const { firstName, lastName, phone, email, password, role } = req.body;

    const sql = `
        UPDATE UserAccount 
        SET FirstName = ?, 
            LastName = ?, 
            Phone = ?, 
            Email = ?, 
            Password = ?, 
            Role = ?
        WHERE UserID = ?
    `;

    const params = [firstName, lastName, phone, email, password, role, userId];

    db.run(sql, params, function(err) {
        if (err) {
            console.error("Update Error:", err.message);
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json({ 
            message: "User updated successfully!", 
            rowsUpdated: this.changes 
        });
    });
});

//add propertiys

  app.get("/Properties", (req, res) => {
 
    db.all("SELECT * FROM Properties", [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        res.json(rows);
    });
});
app.post("/Properties", (req, res) => {
    const { address, neighborhood, sqft, garage, transit } = req.body;
   
    db.run(`
        INSERT INTO Properties
        (Address, Neighborhood, Sqft, Garage, Transit)
        VALUES (?, ?, ?, ?, ?)`, 
        [address, neighborhood, sqft, garage, transit], 
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
       
            res.json({
                message: "Property Added Successfully!",
                PropertyID: this.lastID
            });
        }
    );
});

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
