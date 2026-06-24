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
const bcrypt = require("bcrypt");
 
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

    Password                        VARCHAR(255)			NOT NULL

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
db.run(`CREATE TABLE IF NOT EXISTS Workspaces (

    WorkspaceID INTEGER PRIMARY KEY AUTOINCREMENT,

    PropertyID INT NOT NULL,

    WorkspaceType VARCHAR(100) NOT NULL,

    Seats INTEGER NOT NULL,

    Smoke VARCHAR(10) NOT NULL,

    Date DATE NOT NULL,

    LeaseTerm INT NOT NULL,

    LeaseTermUnit VARCHAR(10) NOT NULL,

    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (PropertyID) REFERENCES Properties(PropertyID)
)`);

// ============================================
// WORKSPACES ROUTES
// ============================================

app.get("/Workspaces", (req, res) => {
    db.all("SELECT * FROM Workspaces", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.post("/Workspaces", (req, res) => {
    console.log("POST /Workspaces received");
    console.log("Data received:", req.body);

    const {
        propertySearch,  // ← Matches what your JavaScript sends
        type,            // ← Matches what your JavaScript sends
        seats,
        smoke,
        date,
        term,            // ← Matches what your JavaScript sends
        dwm              // ← Matches what your JavaScript sends
    } = req.body;

    // Validate all fields are present
    if (!propertySearch || !type || !seats || !smoke || !date || !term || !dwm) {
        console.error("Missing fields!");
        return res.status(400).json({
            error: "All fields are required"
        });
    }

    // Check if PropertyID exists
    db.get("SELECT PropertyID FROM Properties WHERE PropertyID = ?", [propertySearch], (err, row) => {
        if (err) {
            console.error("Database error:", err.message);
            return res.status(500).json({ error: err.message });
        }

        if (!row) {
            console.error(`❌ PropertyID ${propertySearch} does not exist!`);
            return res.status(400).json({
                error: `PropertyID ${propertySearch} does not exist. Please add a property first.`
            });
        }

        console.log(`PropertyID ${propertySearch} exists!`);

        // Insert the workspace
        db.run(
            `INSERT INTO Workspaces
            (PropertyID, WorkspaceType, Seats, Smoke, Date, LeaseTerm, LeaseTermUnit)
            VALUES(?, ?, ?, ?, ?, ?, ?)`,
            [
                propertySearch,  // ← These are the lowercase variables with values
                type,
                seats,
                smoke,
                date,
                term,
                dwm
            ],
            function(err) {
                if (err) {
                    console.error("Database error:", err.message);
                    return res.status(500).json({
                        error: err.message
                    });
                }

                console.log("Workspace created with ID:", this.lastID);
                res.json({
                    message: "Workspace created",
                    WorkspaceID: this.lastID
                });
            }
        );
    });
});

app.put("/Workspaces/:WorkspaceID", (req, res) => {
    const WorkspaceID = req.params.WorkspaceID;
    const {
        propertySearch,
        type,
        seats,
        smoke,
        date,
        term,
        dwm
    } = req.body;

    const sql = `
        UPDATE Workspaces
        SET PropertyID = ?,
            WorkspaceType = ?,
            Seats = ?,
            Smoke = ?,
            Date = ?,
            LeaseTerm = ?,
            LeaseTermUnit = ?
        WHERE WorkspaceID = ?
    `;

    db.run(
        sql,
        [
            propertySearch,
            type,
            seats,
            smoke,
            date,
            term,
            dwm,
            WorkspaceID
        ],
        function(err) {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }
            if (this.changes === 0) {
                return res.status(404).json({
                    message: "Workspace not found"
                });
            }
            res.json({
                message: "Workspace updated successfully",
                rowsUpdated: this.changes
            });
        }
    );
});

app.delete("/Workspaces/:WorkspaceID", (req, res) => {
    const WorkspaceID = req.params.WorkspaceID;
    db.run(
        "DELETE FROM Workspaces WHERE WorkspaceID = ?",
        [WorkspaceID],
        function(err) {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }
            if (this.changes === 0) {
                return res.status(404).json({
                    message: "Workspace not found"
                });
            }
            res.json({
                message: `Workspace ${WorkspaceID} deleted successfully`
            });
        }
    );
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
 
app.post("/Data", async (req, res) => {
    const { firstName, lastName, phone, email, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log("PASSWORD:", password);
        console.log("HASH:", hashedPassword);

        db.run(
            `INSERT INTO UserAccount
            (FirstName, LastName, Phone, Email, Password, Role)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [firstName, lastName, phone, email, hashedPassword, role],
            function(err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                res.json({
                    message: "Person Created",
                    UserID: this.lastID
                });
            }
        );

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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

// update Propertiy

app.put("/Properties/:PropertyID", (req, res) => {
     const  PropertyID = req.params.PropertyID;
    const { address, neighborhood, sqft, garage, transit } = req.body;

    const sql = `
        UPDATE Properties 
        SET address = ?, 
            neighborhood = ?, 
            sqft = ?, 
            garage = ?, 
            transit = ?
        WHERE PropertyID = ?
    `;

    const params = [address, neighborhood, sqft, garage, transit, PropertyID];

    db.run(sql, params, function(err) {
        if (err) {
            console.error("Update Error:", err.message);
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ message: "Property not found." });
        }

        res.json({ 
            message: "Property updated successfully!", 
            rowsUpdated: this.changes 
        });
    });
});


//delete section

app.delete("/data/:id", (req, res) => {
    const userId = req.params.id;

    db.run("DELETE FROM UserAccount WHERE UserID = ?", [userId], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: `User with ID ${userId} deleted successfully.` });
    });
});

//delete user with email and password

// delete user with email and password
app.delete("/data", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }
    
    db.get("SELECT * FROM UserAccount WHERE Email = ?", 
        [email], 
        (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (!user) {
            return res.status(44) 
            return res.status(404).json({ error: "Invalid email or password. Account not found." });
        }
    
        const match = bcrypt.compareSync(password, user.Password);
        if (!match) {
            return res.status(400).json({ error: "Invalid email or password. Account not found." });
        }

        db.run("DELETE FROM UserAccount WHERE UserID = ?", [user.UserID], function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: "User deleted successfully." });
        });
    });
});

app.delete("/Properties/:PropertyID", (req, res) => {
    const  PropertyID = req.params.PropertyID;

    db.run("DELETE FROM Properties WHERE PropertyID = ?", [PropertyID], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: "Property not found" });
        }
        res.json({ message: `Property with ID ${PropertyID} deleted successfully.`});
    });
});
 
 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// login 
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  db.get(
    `SELECT * FROM UserAccount WHERE Email = ?`,
    [email],
    (err, user) => {
      if (err) {
        console.error("Database Error:", err.message);
        return res.status(500).json({ error: err.message });
      }

      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }

     const match = bcrypt.compareSync(password, user.Password);

      if (!match) {
        return res.status(400).json({ error: "Wrong Password" });
      }

      if (req.session) {
        req.session.userId = user.UserID;
        req.session.userName = user.FirstName;
      }

      return res.json({
        message: "Login Successful",
      });
    }
  );
});
