import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const ormconfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: "localhost",
  port: 5432,
  username: "snapbuy_user",
  password: "79Fmf31sMccSx6jPkquL.k0KR211wuipZrGl7Ql",
  database: "snapbuy",
  entities: ['dist/**/*.entity.js'],
  synchronize: true, // solo en dev
};
export default ormconfig;
