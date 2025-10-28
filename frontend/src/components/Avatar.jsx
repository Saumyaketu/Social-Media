import React from 'react';

export default function Avatar({ name, size = 40 }) {
  const initials = (name || 'U')
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // pick color based on char code
  const colors = ['bg-slate-500', 'bg-gray-500', 'bg-zinc-500', 'bg-neutral-500', 'bg-stone-500', 'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500',
                  'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-purple-500',
                  'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500', 'bg-black', 'bg-stone-900'];
  const idx = (initials.charCodeAt(0) || 65) % colors.length;
  const bg = colors[idx];

  const className = `flex items-center justify-center text-white font-medium rounded-full ${bg}`;
  const style = { width: size, height: size, fontSize: Math.max(12, Math.floor(size/2.8)) };

  return (
    <div className={className} style={style} aria-hidden="true">
      {initials}
    </div>
  );
}
