import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';

import ws from 'ws';
neonConfig.webSocketConstructor = ws; 

// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
neonConfig.poolQueryViaFetch = true

// Type definitions
// declare global {
//   var prisma: PrismaClient | undefined
// }

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaNeon({ connectionString });
const prisma = global.prisma || new PrismaClient({ 
    adapter,
    log: ['error', 'warn'],
    errorFormat: 'pretty'
});

if (process.env.NEXT_RUNTIME !== 'edge') global.prisma = prisma;

// Graceful shutdown
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});

export default prisma;