import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";

export const typeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
    type: 'mongodb',
    url: configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/hanghae-crud',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true
});