import {
    INestApplication,
    Injectable,
    Logger,
    OnModuleInit
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    private readonly logger: Logger = new Logger(PrismaService.name);

    constructor(private configService: ConfigService) {
        super({
            datasources: {
                db: {
                    url: configService.get<string>('DATABASE_URL')
                }
            }
        });
    }

    async onModuleInit() {
        this.logger.log('onModuleInit connecting prisma...');
        await this.$connect();
        this.logger.log('onModuleInit prisma connected');
        this.$use(async (params, next) => {
            if (params.action === 'create' && params.model === 'User') {
                const user = params.args.data;
                const hashedPassword = await bcrypt.hash(
                    user.password,
                    this.configService.get<number>('SALT_ROUNDS')
                );
                user.password = hashedPassword;
                params.args.data = user;
            }
            return next(params);
        });
    }

    async enableShutdownHooks(app: INestApplication) {
        this.$on('beforeExit', async () => {
            this.logger.log('enableShutdownHooks closing prisma...');
            await app.close();
            this.logger.log('enableShutdownHooks prisma closed');
        });
    }
}
