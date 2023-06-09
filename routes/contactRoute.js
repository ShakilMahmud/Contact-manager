const route = require("express").Router()

const { getContacts, addContact, getContact, updateContact, deleteContact  } = require("../controllers/contactController")
const validateToken = require("../middleware/validateTokenHandler")


route.use(validateToken)

route.get('/', getContacts)
route.post('/', addContact)
route.get('/:id', getContact)
route.patch('/:id', updateContact)
route.delete('/:id', deleteContact)

module.exports = route