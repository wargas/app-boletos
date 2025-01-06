import { fazerLogout } from '../(auth)/login/actions';
import { getUser } from '../libs/api';

async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  return (
    <div className='h-screen bg-stone-50'>
      <div className='h-14 border-b bg-white flex items-center px-4'>
        <h1 className='font-bold text-2xl'>ADMIN</h1>
        <div className='ml-auto'>
          <span className='mr-2'>{user.fullName}</span>
          <button onClick={fazerLogout}>Sair</button>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

export default AdminLayout;
