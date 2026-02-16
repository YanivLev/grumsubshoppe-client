import { IBM_Plex_Sans } from "next/font/google";
import Link from "next/link"

const ibmPlex = IBM_Plex_Sans({
    subsets: ["latin"],
    variable: "--font-IBM-Plex-Sans",
    weight: ["400", "500", "600", "700"],
});


interface NavLinkProps {
    href : string;
    children : React.ReactNode;
    className? : string;
    onClick?: () => void;
}


export default function NavLink({href, children, className="", onClick }: NavLinkProps) {
    return (
        <Link 
            href={href}
            onClick={onClick} 
            className={`text-black hover:text-green-900 hover:underline 
            hover:font-semibold text-lg tracking-[-0.02em] ${ibmPlex.className} font-regular`}>
            {children}
        </Link>
        
    )
}