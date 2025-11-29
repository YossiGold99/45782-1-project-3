import { Sequelize } from "sequelize-typescript";
import config from 'config'
import User from "../models/User";
import Tour from "../models/Tour";
import Like from "../models/Like";
import Booking from "../models/Booking";

const sequelize = new Sequelize({
    ...config.get('db'),
    dialect: 'mysql',
    models: [User, Tour, Like, Booking],
    logging: console.log
})

export default sequelize