interface UserInterface {
    _id: string
    name: string
    email: string
    pic: string,
    token:string
}


interface ChatInterface {
    _id: string
    chatName: string
    isGroupChat: boolean
    users: UserInterface[]
    latestMessage: string
}


export type { UserInterface, ChatInterface }
