// components/StepWrapper.jsx
export default function StepWrapper({ children, center = false }) {
  const containerClass = `flex flex-col h-screen bg-white px-4 pb-6 pt-10 ${
    center ? 'justify-center' : 'justify-between'
  }`;
  return (
    <div className={containerClass}>
      {children}
    </div>
  );
}
  