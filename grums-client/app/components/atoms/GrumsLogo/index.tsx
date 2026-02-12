import Image from "next/image";
import logo from "../../icons/GrumsLogo.svg";


interface GrumsLogoProps {
    size? : 'sm' | 'lg'
}


export default function GrumsLogo({size='sm'}: GrumsLogoProps ){
    return (
        <Image
            src={logo}
            alt="Grum's Logo"
            width={size === 'lg' ? 136 : 120}
            height={size === 'lg' ? 100 : 120}
            className={size === 'lg' ? "hover:scale-105 transition-all" : "object-contain"}
            priority={size === 'sm'}
            />
    )
}
