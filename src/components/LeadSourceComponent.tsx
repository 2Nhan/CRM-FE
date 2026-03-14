import 'remixicon/fonts/remixicon.css';
import { leadSourceType } from '@/lib/data.leads';
interface Props {
  leadSource: string;
}

const styleMapping: Record<string, { icon: string; bg: string; text: string; border: string }> = {
  Facebook: {
    icon: "ri-facebook-fill",
    bg: "bg-facebook-50",
    text: "text-facebook-600",
    border: "border-facebook-200",
  },
  Website: {
    icon: "ri-global-line",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  LinkedIn: {
    icon: "ri-linkedin-fill",
    bg: "bg-linkedin-50",
    text: "text-linkedin-600",
    border: "border-linkedin-200",
  },
  Form: {
    icon: "ri-file-list-3-line",
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
  },
};

const LeadSourceComponent = ({ leadSource }: Props) => {
  const cfg = styleMapping[leadSource] || {
    icon: "ri-question-line",
    bg: "bg-gray-100",
    text: "text-gray-600",
    border: "border-gray-200",
  };

  return (
    <div
      className={`
        inline-flex items-center gap-1 px-1.5 py-[2px] rounded-md
        text-[10px] font-medium border
        ${cfg.bg} ${cfg.text} ${cfg.border}
      `}
    >
      <i className={`${cfg.icon} text-[11px]`}></i>
      <span className="tracking-tight">{leadSource}</span>
    </div>
  );
};

export default LeadSourceComponent;