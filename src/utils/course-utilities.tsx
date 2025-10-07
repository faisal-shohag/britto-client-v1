import { FileTextIcon, Play, ShieldQuestionIcon } from "lucide-react"
// import { IoDocumentTextOutline } from "react-icons/io5";
export const contentIcon = (type:string, size:number) => {
    const typeIcons = {
        'TEXT': <FileTextIcon size={size}/>,
        'VIDEO': <Play size={size}/>,
        'QUIZ': <ShieldQuestionIcon size={size}/>

    }

    return typeIcons[type]
}