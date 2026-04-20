import "./common.scss"; 

export const metadata = {
  title: "TRIPLOG - 나의 여행 기록",
  description: "지도로 한눈에 보는 나만의 완벽한 동선",
};

export default function RootLayout({ children }) {

  return (
    <html>
      <body>
  
        {children} 
         
      </body>
    </html>
  );
}