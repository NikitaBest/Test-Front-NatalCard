// components/Input.jsx
export default function Input({ value, onChange, placeholder, type = "text" }) {
    return (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border-b border-gray-400 py-2 text-center text-lg focus:outline-none placeholder-gray-400"
      />
    );
  }
  