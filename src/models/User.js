import DataTypes from 'sequelize';
import { sequelize } from '../config/database.js';
import bcrypt from 'bcryptjs';

const user = sequelize.define('user', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
        Comment: 'Organization unique email based on user category'
    },
    password: {
        type: DataTypes.STRING,
        allowNull:false,

        validate: {
            min: 8,
        },
    },
    name: {// // Added for better user identification
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('librarian', 'patron'),
        defaultValue: 'patron',
        allowNull: false
    }
},  {
        tableName: 'users',
        hooks: {
            beforeCreate: async (user) => {
                user.password = await bcrypt.hash(user.password, 12);
            },
            beforeUpdate: async (user) => {
                if(user.changed('password')) {
                    user.password = await bcrypt.hash(user.password, 12);
                }
            }
        }
    });

// Instance method to compare passwords
user.prototype.correctPassword = async function(candiddatePassword, userPassword) {
    return await bcrypt.compare(candiddatePassword, userPassword);
};

export default user;