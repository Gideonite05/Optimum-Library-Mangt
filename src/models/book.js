import DataTypes from 'sequelize';
import { sequelize } from "../config/database.js";

const Bookies = sequelize.define('Bookies', {
    id: {
       type: DataTypes.UUID,
       defaultValue: DataTypes.UUIDV4,
       primaryKey: true,
       allowNull: false, 
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    author: {
       type: DataTypes.STRING,
       allowNull: false, 
    },
    yearPublished: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    edition: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isbn: { // International Standard Book Number (unique serial arrangement)
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    isAvailable: { // Tracks if a physical copy is currently available for borrowing
        type:DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
    }
}, {
        tableName: 'books',
    });

    export default Bookies;