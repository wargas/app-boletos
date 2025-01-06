export const dynamic = 'force-dynamic'; 

export default function LayoutBoleto({
  children,
  modal,
}: {
  modal: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
      {modal}
    </div>
  );
}
