import { FileTextIcon, Play, ShieldQuestionIcon } from "lucide-react"
// import { IoDocumentTextOutline } from "react-icons/io5";
export const contentIcon = (type:string) => {
    const typeIcons = {
        'TEXT': <FileTextIcon/>,
        'VIDEO': <Play/>,
        'QUIZ': <ShieldQuestionIcon/>

    }

    return typeIcons[type]
}