// components/Button.jsx
export default function Button({ children, onClick, disabled, className = '', variant }) {
  const base =
    "rounded-[8px] text-white !text-white font-sans font-light flex items-center justify-center transition hover:opacity-90 disabled:opacity-50 disabled:!text-white text-base";
  const figma =
    "w-[294px] h-[54px] bg-[#1A1A1A] py-[15px] px-[40px]";
  const wide =
    "w-full h-[54px] bg-[#1A1A1A] py-[15px] px-[40px]";

  const style = variant === "wide" ? `${base} ${wide}` : `${base} ${figma}`;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${style} ${className}`}
    >
      {children}
    </button>
  );
}
  