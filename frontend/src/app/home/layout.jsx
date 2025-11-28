import { LayoutWrapper } from "@/components/layout/LayoutWrapper";


export default function RootLayout({ children }) {

  return (
      <div
        className={` antialiased h-full bg-secondary `}
      >
        <LayoutWrapper children={children}/>
      </div>
  );
}
