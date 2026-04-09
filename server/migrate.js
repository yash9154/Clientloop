import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

import User from './src/models/User.js';

async function migratePlainTextPasswords() {
    await mongoose.connect(process.env.MONGODB_URI);

    // Find users whose password does not start with $2 (bcrypt signature)
    const users = await User.find({ password: { $not: /^\$2[aby]\$/ } }).select('+password');

    console.log(`Found ${users.length} users with plaintext passwords.`);

    for (let user of users) {
        if (user.password && user.password.length > 0) {
            console.log(`Migrating password for ${user.email}...`);
            const hashedPassword = await bcrypt.hash(user.password, 12);
            await User.updateOne({ _id: user._id }, { $set: { password: hashedPassword } });
        }
    }

    console.log('Migration complete.');
    process.exit(0);
}

migratePlainTextPasswords().catch(console.error);
