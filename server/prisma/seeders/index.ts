import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

(async () => {
    try {
        console.log('Seeding admin...');

        const email = process.env.ADMIN_EMAIL as string;
        const password = process.env.ADMIN_PASSWORD as string;
        const first_name = process.env.ADMIN_FIRST_NAME as string;
        const last_name = process.env.ADMIN_LAST_NAME as string;
        const username = email.split('@')[0];

        await prisma.user.upsert({
            where: {
                email
            },
            update: {},
            create: {
                email,
                first_name,
                last_name,
                username,
                role: Role.ADMIN,
                password: bcrypt.hashSync(
                    password,
                    parseInt(process.env.BCRYPT_SALT_ROUNDS as string)
                )
            }
        });

        console.log('Admin created');

        console.log('Seeder finished');
    } catch (err) {
        console.error(err);
    }
})();
