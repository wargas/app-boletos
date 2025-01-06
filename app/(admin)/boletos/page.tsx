import Api from '@/app/libs/api';
import { ResponseSearch } from '@/app/types';
import Link from 'next/link';

export const dynamic = 'force-dynamic'; 

export default async function Home() {
  const { data } = await Api.get<ResponseSearch>('search');
  return (
    <div className='w-full max-w-screen-lg mx-auto'>
      <div className='flex items-center'>
        <div className='breadcrumbs'>
          <ul>
            <li>
              <Link href='/dashboard'>Dashboard</Link>
            </li>
            <li>Boletos</li>
          </ul>
        </div>
        <div className='ml-auto'>
          <Link className='btn btn-sm' href={'/boletos/create'}>
            Novo
          </Link>
        </div>
      </div>
      <div className='bg-white shadow rounded-box'>
        <table className='table table-zebra'>
          <thead>
            <tr>
              <th>ID</th>
              <th>DESCRIÇÃO</th>
              <th>VENCIMENTO</th>
              <th>VALOR</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.description}</td>
                <td>{item.due}</td>
                <td>{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className='px-4 py-2 border-t flex justify-end'>
          <span className='font-bold text-lg'>Total: {data.sum.value}</span>
        </div>
      </div>
    </div>
  );
}
