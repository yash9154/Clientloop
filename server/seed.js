import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

import User from './src/models/User.js';
import Client from './src/models/Client.js';
import Project from './src/models/Project.js';

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clientloop');
        console.log('✓ Connected to MongoDB');

        // Clear existing demo data
        await User.deleteMany({ email: { $in: ['demo@agency.com', 'client@demo.com'] } });
        await Client.deleteMany({ email: 'demo@client.com' });
        console.log('✓ Cleared previous demo data');

        // Create Agency User
        const agencyUser = await User.create({
            name: 'Demo Agency',
            email: 'demo@agency.com',
            password: 'Demo@123456', // Will be hashed by User model
            role: 'agency',
            company: 'Demo Agency Inc',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Agency',
            subscription: {
                plan: 'free',
                status: 'active',
                clientLimit: 10,
                projectLimit: 50,
                storageLimit: 500 * 1024 * 1024
            },
            isVerified: true,
            createdAt: new Date()
        });
        console.log('✓ Created agency user: demo@agency.com / password: Demo@123456');

        // Create Client User
        const clientUser = await User.create({
            name: 'Demo Client',
            email: 'client@demo.com',
            password: 'Demo@123456',
            role: 'client',
            company: 'Demo Client Corp',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Client',
            isVerified: true,
            createdAt: new Date()
        });
        console.log('✓ Created client user: client@demo.com / password: Demo@123456');

        // Create a Demo Client (company)
        const demoClient = await Client.create({
            agencyId: agencyUser._id,
            name: 'Acme Corporation',
            email: 'contact@acme.com',
            contactName: 'John Smith',
            phone: '+1-555-0123',
            industry: 'Technology',
            avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Acme',
            status: 'active',
            notes: 'Premium client - high priority',
            lastContact: new Date(),
            createdAt: new Date()
        });
        console.log('✓ Created demo client: Acme Corporation');

        // Link client user to client entity
        await User.updateOne({ _id: clientUser._id }, { clientId: demoClient._id });

        // Create Demo Projects
        const project1 = await Project.create({
            agencyId: agencyUser._id,
            clientId: demoClient._id,
            name: 'Website Redesign',
            description: 'Complete redesign of the company website with modern design and improved user experience',
            status: 'in-progress',
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            budget: 15000,
            progress: 65,
            updatesCount: 5,
            commentsCount: 12,
            priority: 'high',
            createdAt: new Date()
        });
        console.log('✓ Created project 1: Website Redesign');

        const project2 = await Project.create({
            agencyId: agencyUser._id,
            clientId: demoClient._id,
            name: 'Mobile App Development',
            description: 'Native iOS and Android mobile application for client engagement',
            status: 'planning',
            budget: 45000,
            progress: 15,
            updatesCount: 3,
            commentsCount: 8,
            priority: 'high',
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
        });
        console.log('✓ Created project 2: Mobile App Development');

        const project3 = await Project.create({
            agencyId: agencyUser._id,
            clientId: demoClient._id,
            name: 'SEO Optimization',
            description: 'Search engine optimization strategy and implementation',
            status: 'completed',
            progress: 100,
            updatesCount: 8,
            commentsCount: 15,
            priority: 'medium',
            createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
        });
        console.log('✓ Created project 3: SEO Optimization (completed)');

        console.log('\n✅ Database seeding complete!');
        console.log('\n📋 Demo Credentials:');
        console.log('━'.repeat(50));
        console.log('AGENCY LOGIN:');
        console.log('  Email: demo@agency.com');
        console.log('  Password: Demo@123456');
        console.log('━'.repeat(50));
        console.log('CLIENT LOGIN:');
        console.log('  Email: client@demo.com');
        console.log('  Password: Demo@123456');
        console.log('━'.repeat(50));
        console.log('\n3 demo projects created for testing.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error.message);
        process.exit(1);
    }
}

seedDatabase();
