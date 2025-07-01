// components/Button.jsx
export default function Button({ children, onClick, disabled, className = '', variant }) {
  const base =
    "rounded-[8px] text-white !text-white font-sans font-normal flex items-center justify-center transition hover:opacity-90 disabled:opacity-50 disabled:!text-white";
  const figma =
    "w-[294px] h-[54px] bg-[#1A1A1A] text-[24px] py-[15px] px-[40px]";
  const wide =
    "w-full h-[54px] bg-[#1A1A1A] text-[20px] py-[15px] px-[40px]";

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
  