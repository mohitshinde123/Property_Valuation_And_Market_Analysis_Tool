export default function Loader({ size = 'md', text = 'Loading...' }) {
  const sizes = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-14 h-14' };
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="relative">
        <div className={`${sizes[size]} border-[3px] border-blue-100 border-t-blue-600 rounded-full animate-spin`} />
        <div className={`absolute inset-0 ${sizes[size]} border-[3px] border-transparent border-b-indigo-400 rounded-full animate-spin`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
      </div>
      {text && <p className="mt-4 text-gray-400 text-sm font-medium">{text}</p>}
    </div>
  );
}
