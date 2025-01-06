import { fazerLogin } from './actions';

export default async function Logion() {
  

  return (
    <div className='p-4'>
      <h1>LOGIN</h1>

      {process.env.API_URL}

      <form action={fazerLogin}>
        <button type='submit'>Entrar</button>
      </form>
    </div>
  );
}
