import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import User from './User';
import Tour from './Tour';

export enum BookingStatus {
    Pending = 'Pending',
    Confirmed = 'Confirmed',
    Cancelled = 'Cancelled'
}

@Table({
    tableName: 'Bookings',
    timestamps: true
})
class Booking extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    id!: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    userId!: number;

    @ForeignKey(() => Tour)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    tourId!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 1
    })
    numberOfPersons!: number;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    totalPrice!: number;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW
    })
    bookingDate!: Date;

    @Column({
        type: DataType.ENUM('Pending', 'Confirmed', 'Cancelled'),
        defaultValue: 'Pending',
        allowNull: false
    })
    status!: BookingStatus;

    // Relations
    @BelongsTo(() => User, 'userId')
    user!: User;

    @BelongsTo(() => Tour, 'tourId')
    tour!: Tour;
}

export default Booking;
