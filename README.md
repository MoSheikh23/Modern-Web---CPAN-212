Mohame Sheikh 
Converted from JSON to MongoDB:
Replaced JSON file storage with a MongoDB Atlas database using Mongoose.
Created Mongoose Schemas & Models:
Added schemas for Drivers, Vehicles, and Trips with validation rules, enums, and relationships.
incorporated Phase 2 feed about validation and Created driverValidation.js, vehicleValidation.js, and tripValidation.js inside their respective module folders.

Mohamed Mohamed 
Set up .env file:
Added the database connection string and port number.
.env is listed in .gitignore to keep credentials private.
Built Express Server:
Configured Express, middleware, and MongoDB connection in connect-db.js.
Added routes for drivers, vehicles, and trips.
Query Utilities:Added query.utils.js for text search, sorting, and pagination.


