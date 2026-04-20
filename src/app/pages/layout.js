import Link from "next/link";
import Header from "./Header";

export default function RootLayout({ children }) {

  return (
  
        <div className="main">
          <Header />
          <h1 className="logo" >TRIPLOG</h1>

          <main className="container">
            {children} 
          </main>
        </div>
     
  );
}