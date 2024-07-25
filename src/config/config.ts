import * as dotenv from 'dotenv';

dotenv.config();

export default () => ({
    jwtAT: {
      secret: process.env.AT_SECRET || 'default_secret_value',
    },
    jwtRT: {
      secret: process.env.RT_SECRET || 'default_secret_value'
    }
});

