import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import User from './User';
import Tour from './Tour';

@Table({
    tableName: 'Likes',
    timestamps: true
})
class Like extends Model {
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

    // Relations
    @BelongsTo(() => User, 'userId')
    user!: User;

    @BelongsTo(() => Tour, 'tourId')
    tour!: Tour;
}

export default Like;
