import { PropsWithChildren } from 'react';
import { TopNav } from './top-nav';

export function AppShell({ children }: PropsWithChildren) {
  return (
    <>
      <TopNav />
      <main className="container-mobile py-4">{children}</main>
    </>
  );
}
