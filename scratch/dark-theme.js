const fs = require('fs');
const path = require('path');

const files = [
  'app/login/page.tsx',
  'app/(main)/layout.tsx',
  'app/(main)/dashboard/page.tsx',
  'app/(main)/packets/page.tsx',
  'components/Sidebar.tsx'
];

const replacements = [
  { regex: /bg-\[\#fcfcfd\]/g, replacement: 'bg-zinc-950' },
  { regex: /bg-white\/90/g, replacement: 'bg-zinc-950/90' },
  { regex: /bg-white/g, replacement: 'bg-zinc-900' },
  { regex: /bg-slate-50\/30/g, replacement: 'bg-zinc-800/30' },
  { regex: /bg-slate-50\/20/g, replacement: 'bg-zinc-800/20' },
  { regex: /bg-slate-50\/10/g, replacement: 'bg-zinc-800/10' },
  { regex: /bg-slate-50\/50/g, replacement: 'bg-zinc-800/50' },
  { regex: /bg-slate-50/g, replacement: 'bg-zinc-800/50' },
  { regex: /hover:bg-slate-50/g, replacement: 'hover:bg-zinc-800' },
  { regex: /hover:bg-slate-100/g, replacement: 'hover:bg-zinc-700' },
  { regex: /bg-slate-900\/20/g, replacement: 'bg-black/60' },
  
  { regex: /border-slate-100/g, replacement: 'border-zinc-800/80' },
  { regex: /border-slate-50/g, replacement: 'border-zinc-800/50' },
  { regex: /border-slate-200/g, replacement: 'border-zinc-700' },
  
  { regex: /text-slate-900/g, replacement: 'text-zinc-50' },
  { regex: /text-slate-700/g, replacement: 'text-zinc-200' },
  { regex: /text-slate-600/g, replacement: 'text-zinc-300' },
  { regex: /text-slate-500/g, replacement: 'text-zinc-400' },
  { regex: /text-slate-400/g, replacement: 'text-zinc-500' },
  { regex: /text-slate-300/g, replacement: 'text-zinc-600' },
  { regex: /text-slate-200/g, replacement: 'text-zinc-700' },
  { regex: /text-white/g, replacement: 'text-zinc-950' },
  
  { regex: /hover:text-slate-900/g, replacement: 'hover:text-zinc-50' },
  { regex: /hover:text-indigo-700/g, replacement: 'hover:text-cyan-300' },
  { regex: /hover:text-indigo-600/g, replacement: 'hover:text-cyan-400' },

  { regex: /indigo-600/g, replacement: 'cyan-500' },
  { regex: /indigo-700/g, replacement: 'cyan-400' },
  { regex: /indigo-500/g, replacement: 'cyan-500' },
  { regex: /indigo-400/g, replacement: 'cyan-600' },
  { regex: /indigo-300/g, replacement: 'cyan-700' },
  { regex: /indigo-200/g, replacement: 'cyan-800' },
  { regex: /indigo-100/g, replacement: 'cyan-900/50' },
  { regex: /indigo-50/g, replacement: 'cyan-950/50' },

  { regex: /from-indigo-50\/30/g, replacement: 'from-cyan-950/30' },
  { regex: /to-blue-50\/20/g, replacement: 'to-blue-950/20' },
  { regex: /from-indigo-600/g, replacement: 'from-cyan-500' },
  { regex: /to-indigo-700/g, replacement: 'to-cyan-400' },

  { regex: /shadow-indigo-200/g, replacement: 'shadow-cyan-900/20' },
  { regex: /shadow-indigo-100/g, replacement: 'shadow-cyan-900/10' },
  { regex: /border-white/g, replacement: 'border-zinc-950' },
  
  { regex: /bg-emerald-50/g, replacement: 'bg-emerald-500/10' },
  { regex: /border-emerald-100/g, replacement: 'border-emerald-500/20' },
  { regex: /text-emerald-700/g, replacement: 'text-emerald-400' },
  { regex: /text-emerald-600/g, replacement: 'text-emerald-500' },

  { regex: /bg-amber-50/g, replacement: 'bg-amber-500/10' },
  { regex: /border-amber-100/g, replacement: 'border-amber-500/20' },
  { regex: /text-amber-700/g, replacement: 'text-amber-400' },
  { regex: /text-amber-600/g, replacement: 'text-amber-500' },

  { regex: /bg-rose-50/g, replacement: 'bg-rose-500/10' },
  { regex: /border-rose-100/g, replacement: 'border-rose-500/20' },
  { regex: /text-rose-700/g, replacement: 'text-rose-400' },
  { regex: /text-rose-600/g, replacement: 'text-rose-500' },
  
  { regex: /bg-blue-50/g, replacement: 'bg-blue-500/10' },
  { regex: /border-blue-100/g, replacement: 'border-blue-500/20' },
  { regex: /text-blue-700/g, replacement: 'text-blue-400' },
  { regex: /text-blue-600/g, replacement: 'text-blue-500' }
];

files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    replacements.forEach(({ regex, replacement }) => {
      content = content.replace(regex, replacement);
    });
    fs.writeFileSync(filePath, content);
    console.log('Updated ' + file);
  }
});
