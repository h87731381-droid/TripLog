import "./common.scss";
import "./splash.scss";
import Providers from "./comp/Provider";
import Script from "next/script";

export const metadata = {
  title: "TRIPLOG - 나의 여행 기록",
  description: "지도로 한눈에 보는 나만의 완벽한 동선",
};


export default function RootLayout({ children }) {

  return (
    <html>
      <body>
        <Providers>
          {children}

          <Script id="bf-handler" strategy="beforeInteractive">
          {`
            window.addEventListener("pageshow", function(e) {
              const nav = performance.getEntriesByType("navigation")[0];
              const isBackForward = e.persisted || (nav && nav.type === "back_forward");

              if (isBackForward) {
                location.replace(localStorage.pathname);
              }
            });
          `}
          </Script>
        </Providers>
      </body>
    </html>
  );
}