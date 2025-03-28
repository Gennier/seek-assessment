import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
        { emit: 'event', level: 'error' },
      ],
    });

    this.$on('query' as never, (event: any) => {
      console.debug(`Query: ${event.query}`);
      console.debug(`Params: ${event.params}`);
      console.debug(`Duration: ${event.duration}ms`);
    });

    // this.$on('info' as never, (event: any) => {
    //     this.logger.log(`Info: ${event.message}`);
    // });

    // this.$on('warn' as never, (event: any) => {
    //     this.logger.warn(`Warning: ${event.message}`);
    // });

    // this.$on('error' as never, (event: any) => {
    //     this.logger.error(`Error: ${event.message}`);
    // });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
