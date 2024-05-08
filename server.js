const express = require("express");
const mysql = require("mysql")
const bodyParser = require('body-parser');
const cors = require("cors")
const app = express()
const mongoose = require("mongoose");
app.use(bodyParser.json());
const AdminQuestions = require("./models/Admin")
const adminRoute = require("./rootes/Admin");
const punycode = require('punycode/');
const ProblemSolved = require("./models/problemSolved")
//mongo db database connection

const authRoute = require("./rootes/auth");
mongoose
  .connect("mongodb://0.0.0.0:27017/QUERIES")
  .then(console.log("connectd sunccesfu lly"))
  .catch((err) => console.log(err));
app.use(express.json());
app.use(cors());

//sql database connections
let activeDatabase = "sailor"
const db1 = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "your_new_password",
  database: activeDatabase

})
app.get('/', (re, res) => {
  return res.json("FROM BACKEND SIDE");
})
app.post('/api/sendData', (req, res) => {
  const { value, correctanswer, database } = req.body;
  console.log(value);
  console.log(correctanswer);
  console.log(database);
  activeDatabase = database;
  console.log('Received data from frontend:', value);
  //changing database on clicking

  const db1 = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "your_new_password",
    database: activeDatabase
  });

  db1.connect((err) => {
    if (err) {
      console.error('Error connecting to database:', err);
    } else {
      console.log('Connected to new database');
    }
  });

  //ending changing of the database
  //comparing two strings
  const sql2 = correctanswer;
  const sql3 = value;
  console.log(sql3);
  db1.query(sql2, (err, data1) => {
    if (err) return (res.json(err.message));
    else
      db1.query(sql3, (err, data2) => {

        if (err) {
          if (err.code === 'ER_PARSE_ERROR') {
            // Extract the location of the error from the error message
            const matches = err.message.match(/near '([^']+)'/);
            // const errorLocation = matches ? matches[1] : 'unknown';
            const errorLocation = matches ? matches[1].split(/\s+/)[0] : 'unknown';

            // Send a user-friendly error message to the client
            return res.status(400).json({ success: `Oops! There's a problem with your SQL query near '${errorLocation}'. Please double-check it and try again.` });
          }
          else if (err.code === 'ER_NO_SUCH_TABLE') {

            return (res.json({ success: `We're sorry, but the table  doesn't exist. Please try again with a valid table name,` }))
          }
          else if (err.code === 'ER_EMPTY_QUERY') {
            return (res.json({ success: "please enter query" }))
          }
          else if (err.code === 'ER_BAD_FIELD_ERROR') {
            // Extract the problematic column from the error message
            const matches = err.message.match(/Unknown column '([^']+)'/);
            const unknownColumn = matches ? matches[1] : 'unknown';
            // Send a user-friendly error message to the client
            return res.status(400).json({ success: `column '${unknownColumn}' is not present in the database table.` });
          }

          else {
            return (res.json({ success: err.message }))
          }
        }
        else {
          console.log(data2)
          try {

            if (JSON.stringify(data1) === JSON.stringify(data2)) {
              console.log('true');
              res.status(200).json({ success: "correct answer", message: 'Data received successfully', output: data2 });
            }
            else {

              res.json({ success: "wrong answer", message: 'Data received successfully', output: data2 });
              console.log('false');
            }

          }
          catch (err) {
            console.log('true');

          }

        }
      })
  })

});
app.use("/api/auth", authRoute);
//showing all the tables from the database
app.get('/tables/:id', async (req, res) => {

  //changing database 
  const post = await AdminQuestions.findById(req.params.id);
  console.log(post.database);
  console.log(post.database);
  const activeDatabase = post.database;
  const db1 = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "your_new_password",
    database: activeDatabase
  });

  db1.connect((err) => {
    if (err) {
      console.error('Error connecting to database:', err);
    } else {
      console.log('Connected to new database');
    }
  });


  //ending database




  const queryTables = 'SHOW TABLES';
  console.log("database name is" + db1.config.database)
  db1.query(queryTables, (err, resultsTables) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      console.log("bhanupakash")
      const tables = resultsTables.map((row) => row[`Tables_in_${db1.config.database}`]);
      // console.log("show databases"+db1.config.database);
      console.log("the database is" + activeDatabase)

      const dataPromises = tables.map((table) => {
        return new Promise((resolve, reject) => {
          const queryData = `SELECT * FROM ${table}`;
          db1.query(queryData, (err, resultsData) => {
            if (err) {
              reject(err);
            } else {
              resolve({ tableName: table, data: resultsData });
            }
          });
        });
      });

      Promise.all(dataPromises)
        .then((tableData) => {
          console.log("bhanuprakash", tableData);
          res.json({ tables, tableData });
        })
        .catch((error) => {
          res.status(500).json({ error: error.message });
        });
    }
  });
});


//showing database
app.get('/database', (req, res) => {
  const queryTables = 'SHOW databases';
  db1.query(sql2, (err, databasedata) => {

  })

})

//adding new admin

app.get("/api/admin/:id", async (req, res) => {
  try {
    const post = await AdminQuestions.findById(req.params.id);
    console.log(post.database);

    const newDatabase = post.database;
    //creating connection
    const activeDatabase = newDatabase;
    const db1 = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "your_new_password",
      database: activeDatabase
    });

    db1.connect((err) => {
      if (err) {
        console.error('Error connecting to database:', err);
      } else {
        console.log('Connected to new database');
      }
    });
    console.log(post.database);

    //ending connection

    res.status(200).json(post);
  } catch (err) {
    return res.status(404).json("question is not found");
  }
});

//ending showing of the database




//problem solving api
app.post("/api/saveSolvedProblems", async (req, res) => {
  try {
    console.log("not fetching");
    const { username, question } = req.body;
    console.log("The data received is: " + username);


    if (!username || !question) {
      return res.status(400).json('All fields are required');
    }
    const existingProblem = await ProblemSolved.findOne({ username, question });
    if (existingProblem) {
      return res.status(409).json({ error: 'This problem has already been solved by the user' });
    }

    // Assuming you have defined the problemSolved model correctly
    const problem = new ProblemSolved({
      username: username,
      question: question,
    });

    const savedProblem = await problem.save();
    res.status(200).json(savedProblem);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

//api for show data

app.get("/api/findProblemSolvedByUsername/:username", async (req, res) => {
  try {
    const username = req.params.username;


    // Find all documents in the problemSolved collection where the username matches
    const allproblemSolved = (await ProblemSolved.find()).filter(jsonObj => jsonObj.username === username);
    console.log(allproblemSolved)
    // Return the found documents as a JSON response
    res.status(200).json(allproblemSolved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});


//ranking
app.get("/api/userProblemsSolved", async (req, res) => {
  try {
    const userProblems = await ProblemSolved.aggregate([
      // Group by 'username' and count the number of problems solved by each user
      {
        $group: {
          _id: "$username",
          totalProblemsSolved: { $sum: 1 }
        }
      },
      // Sort the results in descending order of 'totalProblemsSolved'
      {
        $sort: { totalProblemsSolved: -1 }
      }
    ]);

    // Return the sorted list of users and the number of problems solved by each
    res.status(200).json(userProblems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});



app.use("/api/admin", adminRoute);
app.listen(3000, () => {
  console.log("listening ");
})