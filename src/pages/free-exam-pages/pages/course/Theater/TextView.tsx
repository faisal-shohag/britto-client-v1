import { Separator } from "@/components/ui/separator";
import MarkdownRenderer from "@/utils/markdown-renderer";


const TextView = ({text, title}) => {
    return (
        <div className="absolute space-y-1 z-50 pb-12 dark:bg-zinc-900 bg-white top-0 left-0 px-3 h-full  py-5 border overflow-y-scroll">
            <h1 className="text-large font-bold">{title}</h1>
            <Separator/>
            <MarkdownRenderer content={text}/>
        </div>
    );
};

export default TextView;