const asyncHandler = require("express-async-handler")
const Contact = require("../models/contactModel")

const redis = require('redis');
const client = redis.createClient({
  host:process.env.REDIS_HOST,
  port:process.env.REDIS_PORT
})

const getContacts = asyncHandler(async (req, res) => {

    let conditions = {};
// admin and staff user can see all data otherwise user can see his created data only
    if(req.user.role === 'user'){
        conditions = { user_id: req.user.id };
    }
    const cacheKey = req.originalUrl;
    // Try to get data from Redis cache
    client.get(cacheKey, async (err, cachedData) => {
        if (err) throw err;
        if (cachedData) {
                // If data exists in Redis cache, return the cached data
                const contacts = JSON.parse(cachedData);
                res.status(200).json({
                    success: true,
                    total_data: contacts.length,
                    source: 'cache',
                    data: contacts
                    
                });
          } else {
            // If data does not exist in Redis cache, query the database
                const contact = await Contact.find(conditions)

                client.set(req.originalUrl, JSON.stringify(contact));
                res.status(200).json({
                    success: true,
                    total_data: contact.length,
                    source: 'database',
                    data: contact
                
                })
        }
    })

})

const addContact = asyncHandler( async (req, res) => {
    const cacheKey = req.originalUrl;

    const createContact = new Contact({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        user_id: req.user.id
    })

    try{
        await createContact.save()

            client.get(cacheKey, (err, oldValue) => {
                if (err) {
                  res.status(500)
                  throw new Error('Error retrieving existing data');
                } else {
                    const existingData = JSON.parse(oldValue);
                    existingData.push(createContact);
                    const updatedData = JSON.stringify(existingData);

                    client.set(cacheKey, updatedData, (err) => {
                      if (err) {
                        res.status(500)
                        throw new Error('Error updating data');
                      } 
                    });
                  }
              });
        res.status(201).json({
            success: true,
            total_data: createContact.length,
            data: createContact
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
        data: contact
        
    })
})

const updateContact =asyncHandler(  async (req, res) => {
      const id = req.params.id;
      const originalUrl = req.originalUrl;

      const updatedId = originalUrl.split('/').pop();
      const cacheKey = originalUrl.substring(0, originalUrl.lastIndexOf('/')).trim();
    
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

        client.get(cacheKey, (err, result) => {
            if (err) {
                res.status(500)
                throw new Error('Error retrieving existing data');
            } else {
              const cachedData = JSON.parse(result);
              const cachedDataIndex = cachedData.findIndex(obj => obj._id === updatedId);

              cachedData[cachedDataIndex] = contact;
              client.set(cacheKey, JSON.stringify(cachedData), (err, result) => {
                if (err) {
                    res.status(500)
                    throw new Error('Error updating data');
                }
              });
            }
          });

        res.status(206).json({
            success: true,
            total_data: contact.length,
            data:contact
           
        })

    }catch(err){
        res.status(404);
        throw new Error(err.message);
    }
})
const deleteContact = asyncHandler( async (req, res) => {
    const id = req.params.id;

    const originalUrl = req.originalUrl;
    const cacheKey = originalUrl.substring(0, originalUrl.lastIndexOf('/')).trim();

    let conditions = {_id: id};
    // admin user can delete all data otherwise user can delete his created data only
        if(req.user.role !== 'admin'){
            conditions = {_id: id, user_id: req.user.id };
        }
    try{
        const contact = await Contact.findOneAndDelete(conditions)

        client.get(cacheKey, (err, cachedData) => {
            if (err) {
              console.error(err);
            } else {
              // Parse the cached data as an array of JSON objects
              const cachedArray = JSON.parse(cachedData);
          
              // Find the index of the data with the matching ID
              const indexToDelete = cachedArray.findIndex((data) => data._id === id);
          
              // If the data was found, remove it from the array
              if (indexToDelete !== -1) {
                cachedArray.splice(indexToDelete, 1);
          
                // Update the cached data for the resource
                client.set(cacheKey, JSON.stringify(cachedArray), (err) => {
                  if (err) {
                    console.error(err);
                  } else {
                    console.log(`Deleted data with ID ${req.params.id} from cache key ${cacheKey}`);
                  }
                });
              }
            }
          });

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