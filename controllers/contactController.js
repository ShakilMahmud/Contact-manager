const asyncHandler = require("express-async-handler")
const Contact = require("../models/contactModel")

const getContacts = asyncHandler(async (req, res) => {
    let conditions = {};
// admin and staff user can see all data otherwise user can see his created data only
    if(req.user.role === 'user'){
        conditions = { user_id: req.user.id };
    }

    const contact = await Contact.find(conditions)
    res.status(200).json({
        success: true,
        total_data: contact.length,
        data:{
            contact
        }
    })
})

const addContact = asyncHandler( async (req, res) => {
 
    const createContact = new Contact({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        user_id: req.user.id
    })

    try{
        await createContact.save()
        res.status(201).json({
            success: true,
            total_data: createContact.length,
            data:{
                createContact
            }
        })
    }
    catch(err){
        res.status(400);
        throw new Error(err.message);
    }
})

const getContact =asyncHandler( async (req, res) => {
    const id = req.params.id;

    let conditions = {_id: id};
    // admin user can see all data otherwise user can see his created data only
        if(req.user.role !== 'admin'){
            conditions = {_id: id, user_id: req.user.id };
        }

    
    const contact = await Contact.findOne(conditions)
    if(!contact){
        res.status(404);
        throw new Error("No Contact Found")
    }
    res.status(202).json({
        success: true,
        data:{
            contact
        }
    })
})
const updateContact =asyncHandler(  async (req, res) => {
      const id = req.params.id;
    
    let conditions = {_id: id};
    // admin user can update all data otherwise user can update his created data only
        if(req.user.role !== 'admin'){
            conditions = {_id: id, user_id: req.user.id };
        }
    try{
        const contact = await Contact.findOneAndUpdate(conditions, req.body, {new: true, runValidators: true})
        if(!contact){
            res.status(404);
            throw new Error("No Contact Found")
        }
        res.status(206).json({
            success: true,
            total_data: contact.length,
            data:{
                contact
            }
        })

    }catch(err){
        res.status(404);
        throw new Error(err.message);
    }
})
const deleteContact = asyncHandler( async (req, res) => {
    const id = req.params.id;
    
    let conditions = {_id: id};
    // admin user can delete all data otherwise user can delete his created data only
        if(req.user.role !== 'admin'){
            conditions = {_id: id, user_id: req.user.id };
        }
    try{
        const contact = await Contact.findOneAndDelete(conditions)
 
        res.status(200).json({
            success: true,
            data:{
               deleted_contact: contact.name
            }
        })
    }catch(err){
        res.status(404);
        throw new Error(err.message);
    }
})


module.exports = { getContacts, addContact, getContact ,updateContact, deleteContact }