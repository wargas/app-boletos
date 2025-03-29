import boletos from '@/boletos.json'
import { prisma } from './prisma'

const insert = await prisma.boleto.createMany({
    data: boletos.map(b => ({
        ...b,
        due: new Date(b.due),
        created_at: new Date(b.created_at),
        updated_at: new Date(b.updated_at),
        value: parseFloat(b.value)
    }))
})

console.log(insert)