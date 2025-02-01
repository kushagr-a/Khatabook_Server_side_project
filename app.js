const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//home page hisab
app.get("/", (req, res) => {
  fs.readdir(`./hissab`, function (err, files) {
    if (err) {
      return res.status(500).send(err);
    } else {
      res.render("index", { files: files });
    }
  });
});

app.get("/create", (req, res) => {
  res.render("create");
});

//edit hissab
app.get("/edit/:filename", (req, res) => {
  fs.readFile(`./hissab/${req.params.filename}`, "utf-8", (err, filedata) => {
    if (err) return res.status(500).send(err);
    else res.render("edit", { filedata, filename: req.params.filename });
  });
});

//show hissab
app.get("/hissab/:filename", (req, res) => {
  fs.readFile(
    `./hissab/${req.params.filename}`,
    "utf-8",
    function (err, filedata) {
      if (err) {
        return res.status(500).send(err);
      } else {
        res.render("hisaab", { filedata, filename: req.params.filename });
      }
    }
  );
});

//delete hissab
app.get("/delete/:filename", (req, res) => {
  fs.unlink(`./hissab/${req.params.filename}`, function (err) {
    if (err) {
      return res.status(500).send(err);
    } else {
      res.redirect("/");
    }
  });
});

//update hissab
app.post("/update/:filename", (req, res) => {
  console.log("POST request received for file:", req.params.filename);
  fs.writeFile(
    `./hissab/${req.params.filename}`,
    req.body.content,
    function (err) {
      if (err) return res.status(500).send(err);
      else res.redirect("/");
    }
  );
});

//create hissab this code used for sigle file on same date

// app.post("/createhisaab", (req, res) => {
//   var currentDate = new Date();
//   var date = `${currentDate.getDate()}-${
//     currentDate.getMonth() + 1
//   }-${currentDate.getFullYear()} `;

//   fs.writeFile(`./hissab/${date}.txt`, req.body.content, (err) => {
//     if (err) return res.status(500).send(err);
//     else res.redirect("/");
//   });
// });

//create hissab this code used for multiple file on same date
app.post("/createhisaab", (req, res) => {
  var currentDate = new Date();
  var date = `${String(currentDate.getDate()).padStart(2, "0")}-${String(
    currentDate.getMonth() + 1
  ).padStart(2, "0")}-${currentDate.getFullYear()}`;

  var baseFileName = `./hissab/${date}`;
  var fileName = `${baseFileName}.txt`;
  var counter = 1;

  while (fs.existsSync(fileName)) {
    counter++;
    fileName = `${baseFileName}_${counter}th.txt`;
    if (counter === 2) {
      fileName = `${baseFileName}_2nd.txt`;
    } else if (counter === 3) {
      fileName = `${baseFileName}_3rd.txt`;
    } else if (counter > 3) {
      fileName = `${baseFileName}_${counter}th.txt`;
    }
  }

  // Write the file
  fs.writeFile(fileName, req.body.content, (err) => {
    if (err) return res.status(500).send(err);
    else res.redirect("/");
  });
});

app.listen(3000, () => {
  console.log("serverrrrr startt..", "go your khatabook site");
});
