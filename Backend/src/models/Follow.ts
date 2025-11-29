import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import User from './User';

@Table({
    tableName: 'Follows',
    timestamps: true
})
class Follow extends Model {
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
    followerId!: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    followingId!: number;

    // Relations
    @BelongsTo(() => User, 'followerId')
    follower!: User;

    @BelongsTo(() => User, 'followingId')
    following!: User;
}

export default Follow;
