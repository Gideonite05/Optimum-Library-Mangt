import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Prep = sequelize.define('Prep', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        PrimaryKey: true,
        allowNull: false,
    },
    borrowDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
    returnDate: { // Null if not yet returned
        type: DataTypes.DATE,
        allowNull: true,
    },
    dueDate: { // Claculated at the time of borrowing
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: { // e.g., 'borrowed', 'returned', 'overdue'
        type: DataTypes.ENUM('borrowed','returned','overdue'),
        defaultValue: 'borrowed',
        allowNull: false,
    }
}, {
    tableName: 'giveOut',
});

export default Prep;