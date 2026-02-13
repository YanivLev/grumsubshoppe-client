

interface IconButtonProps {
  onClick: () => void;
  ariaLabel: string;
  children: React.ReactNode;
  className?: string;
}

export default function IconButton({ onClick, ariaLabel, children, className = "" }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`grid h-10 w-10 place-items-center cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}
