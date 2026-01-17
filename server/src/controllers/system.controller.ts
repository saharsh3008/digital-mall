import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Store from '../models/Store';
import Event from '../models/Event';
import Offer from '../models/Offer';
import { catchAsync } from '../utils/catchAsync';

const users = [
    {
        email: 'admin@digitalmall.com',
        password: 'password123',
        role: 'admin',
        profile: { firstName: 'System', lastName: 'Admin' }
    },
    {
        email: 'manager@nike.com',
        password: 'password123',
        role: 'tenant_manager',
        profile: { firstName: 'Nike', lastName: 'Manager' }
    }
];

const stores = [
    // Fashion
    { name: 'Nike', category: 'Fashion', floorLevel: 1, unitNumber: '101', heroImageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff' },
    { name: 'Zara', category: 'Fashion', floorLevel: 1, unitNumber: '102', heroImageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8' },
    { name: 'H&M', category: 'Fashion', floorLevel: 1, unitNumber: '103', heroImageUrl: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5' },
    { name: 'Uniqlo', category: 'Fashion', floorLevel: 2, unitNumber: '201', heroImageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b' },
    { name: 'Adidas', category: 'Fashion', floorLevel: 2, unitNumber: '202', heroImageUrl: 'https://images.unsplash.com/photo-1518002171953-a080ee322818' },
    { name: 'Levi\'s', category: 'Fashion', floorLevel: 2, unitNumber: '203', heroImageUrl: 'https://images.unsplash.com/photo-1542272617-08f08632893f' },
    { name: 'Gucci', category: 'Fashion', floorLevel: 3, unitNumber: '301', heroImageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050' },

    // Electronics
    { name: 'Apple Store', category: 'Electronics', floorLevel: 1, unitNumber: '105', heroImageUrl: 'https://images.unsplash.com/photo-1595675024853-0f3ec9098ac7' },
    { name: 'Samsung', category: 'Electronics', floorLevel: 1, unitNumber: '106', heroImageUrl: 'https://images.unsplash.com/photo-1610945265078-385842813359' },
    { name: 'Sony Center', category: 'Electronics', floorLevel: 3, unitNumber: '305', heroImageUrl: 'https://images.unsplash.com/photo-1588534448530-5b12879f7274' },

    // Dining
    { name: 'Starbucks Reserve', category: 'Dining', floorLevel: 1, unitNumber: '108', heroImageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93' },
    { name: 'McDonald\'s', category: 'Dining', floorLevel: 4, unitNumber: '401', heroImageUrl: 'https://images.unsplash.com/photo-1552526881-721ce8509ea8' },
    { name: 'Chipotle', category: 'Dining', floorLevel: 4, unitNumber: '402', heroImageUrl: 'https://images.unsplash.com/photo-1596564239824-c8c3e6644265' },
    { name: 'The Cheesecake Factory', category: 'Dining', floorLevel: 1, unitNumber: '110', heroImageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38' },

    // Beauty & Books
    { name: 'Sephora', category: 'Beauty', floorLevel: 2, unitNumber: '210', heroImageUrl: 'https://images.unsplash.com/photo-1522335789203-abd6538d8ad3' },
    { name: 'MAC Cosmetics', category: 'Beauty', floorLevel: 2, unitNumber: '211', heroImageUrl: 'https://images.unsplash.com/photo-1576426863848-c2185fc6e3c1' },
    { name: 'Barnes & Noble', category: 'Books', floorLevel: 3, unitNumber: '310', heroImageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da' },
];

const events = [
    {
        title: 'Summer Music Festival',
        description: 'Live bands playing all weekend.',
        daysOffsetStart: 2,
        daysOffsetEnd: 5,
        locationName: 'Central Atrium',
        bannerUrl: 'https://images.unsplash.com/photo-1459749411177-287ce3276916'
    },
    {
        title: 'Tech Expo 2024',
        description: 'Experience the latest gadgets.',
        daysOffsetStart: 10,
        daysOffsetEnd: 12,
        locationName: 'Exhibition Hall',
        bannerUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b'
    },
    {
        title: 'Midnight Sale',
        description: 'Up to 70% off on all brands.',
        daysOffsetStart: -1, // Started yesterday
        daysOffsetEnd: 1,
        locationName: 'Mall Wide',
        bannerUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b'
    },
    {
        title: 'Kids Workshop',
        description: 'Lego building competition.',
        daysOffsetStart: 5,
        daysOffsetEnd: 5,
        locationName: 'Kids Zone',
        bannerUrl: 'https://images.unsplash.com/photo-1560969184-10fe8719e047'
    },
    {
        title: 'Food Carnival',
        description: 'Taste dishes from around the world.',
        daysOffsetStart: 15,
        daysOffsetEnd: 20,
        locationName: 'Food Court',
        bannerUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1'
    }
];

export const seedDatabase = catchAsync(async (req: Request, res: Response) => {
    // Simple protection: only allow if query key matches
    if (req.query.key !== 'render-deploy-seed') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const userCount = await User.countDocuments();
    if (userCount > 0) {
        return res.status(200).json({ message: 'Database already seeded. Operation skipped.' });
    }

    // 1. Create Users
    const hashedUsers = await Promise.all(users.map(async (u) => ({
        ...u,
        password: await bcrypt.hash(u.password, 10)
    })));

    const createdUsers = await User.create(hashedUsers);
    const tenantUser = createdUsers.find(u => u.role === 'tenant_manager') || createdUsers[0];

    // 2. Create Stores
    const storesWithData = stores.map(store => ({
        ...store,
        slug: store.name.toLowerCase().replace(/['\s]/g, '-'),
        description: `Welcome to ${store.name}. We offer the best in ${store.category}.`,
        tenantId: tenantUser._id,
        location: {
            type: 'Point',
            coordinates: [-73.85 + (Math.random() * 0.01), 40.84 + (Math.random() * 0.01)],
            floorLevel: store.floorLevel,
            unitNumber: store.unitNumber
        },
        operatingHours: {
            mon: { open: '10:00', close: '21:00' },
            tue: { open: '10:00', close: '21:00' },
            wed: { open: '10:00', close: '21:00' },
            thu: { open: '10:00', close: '21:00' },
            fri: { open: '10:00', close: '22:00' },
            sat: { open: '10:00', close: '22:00' },
            sun: { open: '11:00', close: '20:00' },
        },
        logoUrl: `https://ui-avatars.com/api/?name=${store.name}&background=random`
    }));
    const createdStores = await Store.create(storesWithData);

    // 3. Create Events
    const eventsWithDates = events.map(evt => {
        const start = new Date();
        const end = new Date();
        start.setDate(start.getDate() + evt.daysOffsetStart);
        end.setDate(end.getDate() + evt.daysOffsetEnd);

        return {
            title: evt.title,
            description: evt.description,
            bannerUrl: evt.bannerUrl,
            locationName: evt.locationName,
            startDate: start,
            endDate: end,
            tags: ['Featured', 'Public']
        };
    });
    await Event.create(eventsWithDates);

    // 4. Create Offers (New!)
    console.log('Creating offers...');
    // Pick random stores for offers
    const nike = createdStores.find(s => s.name === 'Nike');
    const starbucks = createdStores.find(s => s.name === 'Starbucks Reserve');
    const sephora = createdStores.find(s => s.name === 'Sephora');
    const hnm = createdStores.find(s => s.name === 'H&M');

    const offers = [
        {
            title: 'Flat 50% Off Running Shoes',
            storeId: nike?._id,
            code: 'RUN50',
            description: 'Get half price on all Zoom series running shoes.',
            validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // +7 days
        },
        {
            title: 'Buy 1 Get 1 Free Coffee',
            storeId: starbucks?._id,
            code: 'BOGOJAVA',
            description: 'Valid on all Grande sized beverages.',
            validUntil: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // +2 days
        },
        {
            title: 'Free Makeover Session',
            storeId: sephora?._id,
            code: 'GLAMUP',
            description: 'Book a free 15-min makeover with any purchase.',
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // +30 days
        },
        {
            title: 'Seasonal Clearance Sale',
            storeId: hnm?._id,
            code: 'SUMMER30',
            description: 'Extra 30% off on clearance items.',
            validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // +5 days
        }
    ].filter(o => o.storeId); // Safety check

    await Offer.create(offers);

    res.status(200).json({
        success: true,
        message: 'Database seeded successfully',
        stats: {
            users: createdUsers.length,
            stores: createdStores.length,
            events: events.length,
            offers: offers.length
        }
    });
});
