// import React from 'react'
// import { WinodwButtons } from './window-button'

import { useAuth } from "../hook/useAuth";

// export default React.memo((props: any) => {
    
//     return (
//         <div className='bg-red-50 p-16'>
//             <WinodwButtons />
//         </div>
//     )
// })

// src/renderer/App.tsx
export default function App() {
  const { user, login, logout, call } = useAuth();

  return (
    <div>
      {!user ? (
        <form onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget as HTMLFormElement;
          const u = (form.elements.namedItem("u") as HTMLInputElement).value;
          const p = (form.elements.namedItem("p") as HTMLInputElement).value;
          await login(u, p);
        }}>
          <input name="u" placeholder="username" />
          <input name="p" placeholder="password" type="password" />
          <button type="submit">Login</button>
        </form>
      ) : (
        <>
          <div>Bienvenue {user.username} — role: {user.role}</div>
          <button onClick={logout}>Logout</button>
          <button onClick={async () => {
            const data = await call(window.electron.categories.getAll);
            console.log(data);
          }}>Lister produits</button>
        </>
      )}
    </div>
  );
}
