import MarkdownRenderer from "@/utils/markdown-renderer";

const TextView = ({text}) => {
    return (
        <div>
            <MarkdownRenderer content={text}/>
        </div>
    );
};

export default TextView;