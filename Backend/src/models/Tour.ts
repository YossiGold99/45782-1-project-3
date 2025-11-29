import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import Booking from './Booking';
import Like from './Like';

@Table({
    tableName: 'Tours',
    timestamps: true
})
class Tour extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    id!: number;

    @Column({
        type: DataType.STRING(500),
        allowNull: false
    })
    title!: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    description!: string | null;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    destination!: string;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    price!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        comment: 'Duration in days'
    })
    duration!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0
    })
    availableSpots!: number;

    @Column({
        type: DataType.DATEONLY,
        allowNull: true
    })
    startDate!: Date | null;

    @Column({
        type: DataType.DATEONLY,
        allowNull: true
    })
    endDate!: Date | null;

    @Column({
        type: DataType.STRING(500),
        allowNull: true
    })
    imageUrl!: string | null;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true,
        allowNull: false
    })
    isActive!: boolean;

    // Relations
    @HasMany(() => Booking, 'tourId')
    bookings!: Booking[];

    @HasMany(() => Like, 'tourId')
    likes!: Like[];
}

export default Tour;
