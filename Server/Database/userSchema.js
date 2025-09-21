const mongoose = require('mongoose');
const { string, email } = require('zod');

const user = new mongoose.Schema({
    _id: string,
    firstName: string,
    lastName: string,
    email:email,
    password: string,

})

export default Users = mongoose.model('user', user)