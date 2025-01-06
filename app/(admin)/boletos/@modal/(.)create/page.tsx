'use client';

import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic'; 

export default function ModalCreate() {
  // const [state, formAction, pedding] = useActionState(, new FormData);
  const router = useRouter();



  return (
    <div className='absolute inset-0 flex justify-center items-center'>
      <div
        onClick={() => {
          router.back();
        }}
        className='absolute inset-0 bg-black/90 cursor-pointer '></div>
      <form
        action="/boletos/action"
        method='post'
        className='relative bg-white w-full max-w-lg shadow-lg rounded-box'>
        
        <div className='px-4 py-3 border-b'>
          <h1 className='font-bold text-2xl'>Cadastrar boleto</h1>
        </div>
        <div className='p-4 flex flex-col gap-4'>
          <div className='flex'>
            <input
              placeholder='Descrição'
              type='text'
              name='description'
              className='input input-bordered w-full'
            />
          </div>
          <div className='flex'>
            <input
              placeholder='Data'
              type='date'
              name='due'
              className='input input-bordered'
            />
          </div>
          <div className='flex'>
            <input
              placeholder='Valor'
              type='text'
              name='value'
              className='input input-bordered'
            />
          </div>
        </div>
        <div className='p-4 flex'>
          <button className='btn' onClick={() => router.back()}>
            Cancelar
          </button>
          <button type='submit' className='btn ml-auto btn-primary'>
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}
