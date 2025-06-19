import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";

export const typeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
    type: 'postgres',
    url: `postgresql://postgres.fyxacgunrakumvzuawwt:${configService.get('PASSWORD')}@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres`,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    ssl: {
        rejectUnauthorized: false
    },
    synchronize: true
});