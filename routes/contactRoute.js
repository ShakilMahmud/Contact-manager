const route = require("express").Router()
const { getContacts, addContact, getContact, updateContact, deleteContact  } = require("../controllers/contactController")
const validateToken = require("../middleware/validateTokenHandler")


route.get('/', getContacts)
route.use(validateToken)
route.post('/', addContact)
route.get('/:id', getContact)
route.patch('/:id', updateContact)
route.delete('/:id', deleteContact)

module.exports = route