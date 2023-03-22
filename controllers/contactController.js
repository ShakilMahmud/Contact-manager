const asyncHandler = require("express-async-handler")
const Contact = require("../models/contactModel")

const getContacts = asyncHandler(async (req, res) => {
    const contact = await Contact.find()
    res.status(200).send(contact)
})

const addContact = asyncHandler( async (req, res) => {
    const createContact = new Contact({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        user_id: req.user._id
    })

    try{
        await createContact.save()
        res.status(201).send(createContact)
    }
    catch(err){
        res.status(400);
        throw new Error(err.message);
    }
})

const getContact =asyncHandler( async (req, res) => {
    const id = req.params.id
    const contact = await Contact.findById(id)
    if(!contact){
        res.status(404);
        throw new Error("No Contact Found")
    }
    res.status(202).send(contact)
})
const updateContact =asyncHandler(  async (req, res) => {
    const id = req.params.id
    try{
        const contact = await Contact.findByIdAndUpdate(id, req.body, {new: true, runValidators: true})
        if(!contact){
            res.status(404);
            throw new Error("No Contact Found")
        }
        res.status(206).send(contact)

    }catch(err){
        res.status(404);
        throw new Error(err.message);
    }
})
const deleteContact = asyncHandler( async (req, res) => {
     const id = req.params.id
    try{
        const contact = await Contact.findByIdAndDelete(id)
 
        res.status(200).send("deleted contact " + contact.name)      
    }catch(err){
        res.status(404);
        throw new Error(err.message);
    }
})


module.exports = { getContacts, addContact, getContact ,updateContact, deleteContact }