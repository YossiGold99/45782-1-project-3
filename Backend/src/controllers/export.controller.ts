import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import ExcelJS from 'exceljs';
import User from '../models/User';
import Tour from '../models/Tour';
import Booking from '../models/Booking';
import Like from '../models/Like';

export async function exportUsersCSV(req: Request, res: Response, next: NextFunction) {
    try {
        // Only admins can export data
        if (req.user!.role !== 'Admin') {
            return next({
                status: 403,
                message: 'Only admins can export data'
            });
        }

        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });

        // Create CSV
        const csvHeaders = ['ID', 'First Name', 'Last Name', 'Username', 'Email', 'Role', 'Created At'];
        const csvRows = users.map(user => [
            user.id,
            user.firstName,
            user.lastName,
            user.username,
            user.email,
            user.role,
            user.createdAt
        ]);

        const csv = [
            csvHeaders.join(','),
            ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
        res.send(csv);
    } catch (error) {
        next(error);
    }
}

export async function exportUsersExcel(req: Request, res: Response, next: NextFunction) {
    try {
        // Only admins can export data
        if (req.user!.role !== 'Admin') {
            return next({
                status: 403,
                message: 'Only admins can export data'
            });
        }

        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Users');

        // Add headers
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'First Name', key: 'firstName', width: 15 },
            { header: 'Last Name', key: 'lastName', width: 15 },
            { header: 'Username', key: 'username', width: 15 },
            { header: 'Email', key: 'email', width: 25 },
            { header: 'Role', key: 'role', width: 10 },
            { header: 'Created At', key: 'createdAt', width: 20 }
        ];

        // Style headers
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' }
        };

        // Add data
        users.forEach(user => {
            worksheet.addRow({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');
        
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        next(error);
    }
}

export async function exportToursCSV(req: Request, res: Response, next: NextFunction) {
    try {
        // Only admins can export data
        if (req.user!.role !== 'Admin') {
            return next({
                status: 403,
                message: 'Only admins can export data'
            });
        }

        const tours = await Tour.findAll({
            include: [{
                model: Booking,
                as: 'bookings'
            }]
        });

        const csvHeaders = ['ID', 'Title', 'Destination', 'Price', 'Duration', 'Available Spots', 'Start Date', 'End Date', 'Bookings Count', 'Created At'];
        const csvRows = tours.map(tour => [
            tour.id,
            tour.title,
            tour.destination,
            tour.price,
            tour.duration,
            tour.availableSpots,
            tour.startDate,
            tour.endDate,
            tour.bookings?.length || 0,
            tour.createdAt
        ]);

        const csv = [
            csvHeaders.join(','),
            ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=tours.csv');
        res.send(csv);
    } catch (error) {
        next(error);
    }
}

export async function exportToursExcel(req: Request, res: Response, next: NextFunction) {
    try {
        // Only admins can export data
        if (req.user!.role !== 'Admin') {
            return next({
                status: 403,
                message: 'Only admins can export data'
            });
        }

        const tours = await Tour.findAll({
            include: [
                {
                    model: Booking,
                    as: 'bookings'
                },
                {
                    model: Like,
                    as: 'likes'
                }
            ]
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Tours');

        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Title', key: 'title', width: 30 },
            { header: 'Destination', key: 'destination', width: 20 },
            { header: 'Price', key: 'price', width: 15 },
            { header: 'Duration', key: 'duration', width: 12 },
            { header: 'Available Spots', key: 'availableSpots', width: 15 },
            { header: 'Start Date', key: 'startDate', width: 15 },
            { header: 'End Date', key: 'endDate', width: 15 },
            { header: 'Likes Count', key: 'likesCount', width: 15 },
            { header: 'Bookings Count', key: 'bookingsCount', width: 15 },
            { header: 'Created At', key: 'createdAt', width: 20 }
        ];

        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' }
        };

        tours.forEach(tour => {
            worksheet.addRow({
                id: tour.id,
                title: tour.title,
                destination: tour.destination,
                price: tour.price,
                duration: tour.duration,
                availableSpots: tour.availableSpots,
                startDate: tour.startDate,
                endDate: tour.endDate,
                likesCount: tour.likes?.length || 0,
                bookingsCount: tour.bookings?.length || 0,
                createdAt: tour.createdAt
            });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=tours.xlsx');
        
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        next(error);
    }
}
