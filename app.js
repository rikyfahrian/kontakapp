/** @format */

const express = require("express");
const app = express();
const { loadContact, findContact, addContact, cekDuplikat, deleteContact, updateContacts } = require("./utils/contacts.js");
const { body, validationResult, check } = require("express-validator");
const expressLayout = require("express-ejs-layouts");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const port = 3000;

app.set("view engine", "ejs");
app.use(expressLayout); //third part middleware
app.use(express.static("public")); // built in middleware
app.use(express.urlencoded({ extended: true })); // built in middleware

//konfigurasi flash
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

app.get("/", (req, res) => {
  res.render("index", { layout: "layouts/main.ejs", title: "Home" });
});

app.get("/about", (req, res) => {
  res.render("about", { layout: "layouts/main.ejs", title: "About" });
});
//halaman kontak
app.get("/contact", (req, res) => {
  const contacts = loadContact();

  res.render("contacts", {
    layout: "layouts/main.ejs",
    title: "Contact",
    contacts,
    msg: req.flash("msg"),
    pesan: req.flash("pesan"),
  });
});
// halaman menambahkan data kontak baru
app.get("/contact/add", (req, res) => {
  res.render("addcontact", {
    title: "Tambah Data Kontak",
    layout: "layouts/main.ejs",
  });
});

//proses menambahkan kontak
app.post(
  "/contact",
  [
    body("nama").custom((value) => {
      const duplikat = cekDuplikat(value);
      if (duplikat) {
        throw new Error("Nama contact sudah ada");
      }
      return true;
    }),
    check("email", "email tidak valid").isEmail(),
    check("nohp", "Nomer telepon harus indonesia").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      res.render("addcontact", {
        layout: "layouts/main.ejs",
        title: "Tambah Data Kontak",
        errors: errors.array(),
      });
    } else {
      addContact(req.body);
      //kirimkan flash mesage dulu
      req.flash("msg", `${req.body.nama} berhasil ditambahkan`);
      res.redirect("/contact");
    }
  }
);

//hapus kontak
app.get("/contact/delete/:nama", (req, res) => {
  const contact = findContact(req.params.nama);

  if (!contact) {
    res.status(404);
    res.send("<h1> gada goblok</h1>");
  } else {
    deleteContact(req.params.nama);
    req.flash("pesan", `${contact.nama} berhasil dihapus`);
    res.redirect("/contact");
  }
});

//halaman ubah data
app.get("/contact/edit/:nama", (req, res) => {
  const contact = findContact(req.params.nama);

  res.render("editcontact", {
    title: "Form Ubah Data Kontak",
    layout: "layouts/main.ejs",
    contact,
  });
});

//process ubah kontak
app.post(
  "/contact/update",
  [
    body("nama").custom((value, { req }) => {
      const duplikat = cekDuplikat(value);
      if (value !== req.body.oldName && duplikat) {
        throw new Error("Nama contact sudah ada");
      }
      return true;
    }),
    check("email", "email tidak valid").isEmail(),
    check("nohp", "Nomer telepon harus nomer telepon indonesia").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      res.render("editcontact", {
        layout: "layouts/main.ejs",
        title: "Ubah Data Kontak",
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      updateContacts(req.body);
      //kirimkan flash mesage dulu
      req.flash("msg", ` data kontak berhasil diubah`);
      res.redirect("/contact");
    }
  }
);

//halaman detail
app.get("/contact/:nama", (req, res) => {
  const contact = findContact(req.params.nama);

  res.render("detail", {
    layout: "layouts/main.ejs",
    title: "Contact",
    contact,
  });
});

app.get("/doc", (req, res) => {
  res.render("doc", { layout: "layouts/main.ejs", title: "Document" });
});

app.use("/", (req, res) => {
  res.status(404);
  res.send("file not found");
});

app.listen(port, () => {
  console.log(`server berjalan di localhost:${port}`);
});
