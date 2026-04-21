import { PropsWithChildren } from 'react';
import { TopNav } from './top-nav';

export function AppShell({ children }: PropsWithChildren) {
  return (
    <>
      <TopNav />
      <main className="container-mobile py-5 lg:py-7">{children}</main>
    </>
  );
}
