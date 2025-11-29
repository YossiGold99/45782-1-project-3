import { Table, Column, Model, DataType, HasMany, HasOne } from 'sequelize-typescript';
import Like from './Like';
import Booking from './Booking';

export enum UserRole {
    User = 'User',
    Admin = 'Admin'
}

@Table({
    tableName: 'Users',
    timestamps: true
})
class User extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    id!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    firstName!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    lastName!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true
    })
    username!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true
    })
    email!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    password!: string;

    @Column({
        type: DataType.ENUM('User', 'Admin'),
        defaultValue: 'User',
        allowNull: false
    })
    role!: UserRole;

    // Relations
    @HasMany(() => Like, 'userId')
    likes!: Like[];

    @HasMany(() => Booking, 'userId')
    bookings!: Booking[];
}

export default User;
