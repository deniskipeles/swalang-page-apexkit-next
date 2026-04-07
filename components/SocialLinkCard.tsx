import React from 'react';

export interface SocialLink {
  name: string;
  url: string;
  description: string;
  platform: string;
}

const iconClasses = "w-8 h-8";

export const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  Website: <i className={`fa-solid fa-globe ${iconClasses} text-sky-400`}></i>,
  Discord: <i className={`fa-brands fa-discord ${iconClasses} text-indigo-400`}></i>,
  GitHub: <i className={`fa-brands fa-github ${iconClasses} text-slate-300`}></i>,
  Twitter: <i className={`fa-brands fa-twitter ${iconClasses} text-blue-400`}></i>,
  Reddit: <i className={`fa-brands fa-reddit-alien ${iconClasses} text-orange-500`}></i>,
  Facebook: <i className={`fa-brands fa-facebook ${iconClasses} text-blue-600`}></i>,
  Instagram: <i className={`fa-brands fa-instagram ${iconClasses} text-pink-500`}></i>,
  WhatsApp: <i className={`fa-brands fa-whatsapp ${iconClasses} text-green-500`}></i>,
  Guidelines: <i className={`fa-solid fa-book-open ${iconClasses} text-amber-400`}></i>,
  Discussions: <i className={`fa-solid fa-comments ${iconClasses} text-lime-400`}></i>,
  Bug: <i className={`fa-solid fa-bug ${iconClasses} text-red-400`}></i>,
  Telegram: <i className={`fa-brands fa-telegram ${iconClasses} text-sky-500`}></i>,
  Slack: <i className={`fa-brands fa-slack ${iconClasses} text-purple-500`}></i>,
  Other: <i className={`fa-solid fa-users ${iconClasses} text-slate-400`}></i>,
};

export const PLATFORM_COLORS: Record<string, { border: string; name: string }> = {
    Website: { border: 'hover:border-sky-400 dark:hover:border-sky-400', name: 'group-hover:text-sky-400 dark:group-hover:text-sky-300' },
    Discord: { border: 'hover:border-indigo-400 dark:hover:border-indigo-400', name: 'group-hover:text-indigo-400 dark:group-hover:text-indigo-300' },
    GitHub: { border: 'hover:border-slate-400 dark:hover:border-slate-400', name: 'group-hover:text-slate-400 dark:group-hover:text-slate-300' },
    Twitter: { border: 'hover:border-blue-400 dark:hover:border-blue-400', name: 'group-hover:text-blue-400 dark:group-hover:text-blue-300' },
    Reddit: { border: 'hover:border-orange-500 dark:hover:border-orange-500', name: 'group-hover:text-orange-500 dark:group-hover:text-orange-400' },
    Facebook: { border: 'hover:border-blue-600 dark:hover:border-blue-600', name: 'group-hover:text-blue-600 dark:group-hover:text-blue-500' },
    Instagram: { border: 'hover:border-pink-500 dark:hover:border-pink-500', name: 'group-hover:text-pink-500 dark:group-hover:text-pink-400' },
    WhatsApp: { border: 'hover:border-green-500 dark:hover:border-green-500', name: 'group-hover:text-green-500 dark:group-hover:text-green-400' },
    Guidelines: { border: 'hover:border-amber-400 dark:hover:border-amber-400', name: 'group-hover:text-amber-400 dark:group-hover:text-amber-300' },
    Discussions: { border: 'hover:border-lime-400 dark:hover:border-lime-400', name: 'group-hover:text-lime-400 dark:group-hover:text-lime-300' },
    Bug: { border: 'hover:border-red-400 dark:hover:border-red-400', name: 'group-hover:text-red-400 dark:group-hover:text-red-300' },
    Telegram: { border: 'hover:border-sky-500 dark:hover:border-sky-500', name: 'group-hover:text-sky-500 dark:group-hover:text-sky-400' },
    Slack: { border: 'hover:border-purple-500 dark:hover:border-purple-500', name: 'group-hover:text-purple-500 dark:group-hover:text-purple-400' },
    Other: { border: 'hover:border-slate-400 dark:hover:border-slate-400', name: 'group-hover:text-slate-400 dark:group-hover:text-slate-300' },
};

const SocialLinkCard: React.FC<SocialLink> = ({ name, url, description, platform }) => {
  const icon = PLATFORM_ICONS[platform] || PLATFORM_ICONS['Other'];
  const colors = PLATFORM_COLORS[platform] || { 
      border: 'hover:border-teal-500 dark:hover:border-teal-400', 
      name: 'group-hover:text-teal-500 dark:group-hover:text-teal-300' 
  };
  
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block bg-white/50 dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 ${colors.border} transition-all duration-300 group`}
    >
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">{icon}</div>
        <div>
          <h3 className={`text-lg font-semibold text-slate-800 dark:text-slate-100 ${colors.name} transition-colors`}>
            {name}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{description}</p>
        </div>
      </div>
    </a>
  );
};

export default SocialLinkCard;
