import user from './User.js';
import { Bookies } from "./book.js";
import Prep from './toReturn.js';

// Define Associations
// A User can have many Loans
user.hasMany(Prep, { foreignKey: 'userId', as: 'Outake'});
Prep.belongsTo(user, { foreignKey: 'userId', as: 'patron'});

// A book can be part of many loans
Bookies.hasMany(Prep, { foreignKey: 'bookId', as: 'hit'});
Prep.belongsTo(Bookies, { foreignKey: 'bookId', as: 'borrowedBook'});

// Export all models
export { user, Bookies, Prep}