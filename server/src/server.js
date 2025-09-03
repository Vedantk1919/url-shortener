const mongoose = require('mongoose');
mongoose.set('strictQuery', true); 
const connect = require('./configs/db');
const app = require('./index');
require("dotenv").config(); 
const PORT = process.env.PORT || 5000;

console.log('JWT_SECRET loaded:', process.env.JWT_SECRET ? 'YES' : 'NO');
console.log('JWT_EXPIRE:', process.env.JWT_EXPIRE);
console.log('BASEURI:', process.env.BASEURI);

app.listen(PORT, async () => {
    try {
        await connect();
        console.log(`Server is running on ${PORT}`);

    } catch (error) {
        console.log(error.message);
    }
});