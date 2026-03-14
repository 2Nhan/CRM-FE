import Link from 'next/link';
import Image from 'next/image';
import { Menu } from '../../components/Menu';
import Navbar from '@/components/Navbar';
import { LeadDetailSelectProvider } from '@/providers/LeadDetailSelectProvider';
import { LeadStageColumnProvider } from '@/providers/LeadStageColumnProvider';
import { QuotationTableProvider } from '@/providers/QuotationTableProvider';
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="
        w-[14%] 
        md:w-[8%]
        lg:w-[16%]
        xl:w-[14%]
        p-4"
      >
        {/* Navbar Logo */}
        <Link className="flex items-center justify-center lg:justify-start gap-2" href="/" >
          <Image src="/logo.png" alt="logo" width={32} height={32} />
          <span className="hidden lg:block">Vera CRM</span>
        </Link>
        {/* Navbar menu */}
        <Menu />
      </div>

      {/* RIGHT */}
      <div className="
        w-[86%] 
        md:w-[92%]
        lg:w-[84%]
        xl:w-[86%]
        bg-[#F7F8FA]
        overflow-hidden
        overflow-y-auto
        flex 
        flex-col
        pl-4"
      >
        <Navbar />
        {children}
      </div>

    </div>
  );
}