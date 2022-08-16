/** @format */

const fs = require("fs");

const path = "./data";
if (!fs.existsSync(path)) {
  fs.mkdirSync(path);
}

const pathFile = "./data/contacts.json";
if (!fs.existsSync(pathFile)) {
  fs.writeFileSync(pathFile, "[]", "utf-8");
}

const loadContact = () => {
  const fileBuffer = fs.readFileSync("data/contacts.json", "utf-8");
  const contacts = JSON.parse(fileBuffer);
  return contacts;
};

const findContact = (nama) => {
  const contacts = loadContact();
  const contact = contacts.find((contact) => contact.nama === nama);
  return contact;
};

//menimpa file contacts.json
const saveContacts = (contacts) => {
  fs.writeFileSync("data/contacts.json", JSON.stringify(contacts));
};

//menambahkan contact
const addContact = (contact) => {
  const contacts = loadContact();
  contacts.push(contact);
  saveContacts(contacts);
};

//cek nama yang dupiklat
const cekDuplikat = (nama) => {
  const contacts = loadContact();
  return contacts.find((contact) => contact.nama === nama);
};

//hapus kontak
const deleteContact = (nama) => {
  const contacts = loadContact();
  const filteredContacts = contacts.filter((contact) => contact.nama !== nama);
  saveContacts(filteredContacts);
};

//mengubah contact
const updateContacts = (contactBaru) => {
  const contacts = loadContact();
  //hilanngkan contact lama yang namanya sama dengan oldNama
  const filter = contacts.filter((c) => c.nama !== contactBaru.oldName);
  delete contactBaru.oldName;

  filter.push(contactBaru);
  saveContacts(filter);
};

module.exports = { loadContact, findContact, addContact, cekDuplikat, deleteContact, updateContacts };
