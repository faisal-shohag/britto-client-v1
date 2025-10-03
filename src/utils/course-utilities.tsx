import { ShieldQuestionIcon, TextIcon, VideoIcon } from "lucide-react"

export const contentIcon = (type:string) => {
    const typeIcons = {
        'TEXT': <TextIcon/>,
        'VIDEO': <VideoIcon/>,
        'QUIZ': <ShieldQuestionIcon/>

    }

    return typeIcons[type]
}