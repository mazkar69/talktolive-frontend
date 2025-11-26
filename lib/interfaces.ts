interface UserInterface {
    _id: string
    name: string
    email: string
    pic: string,
    token:string,
    lastSeen?: Date,
    
}


interface ChatInterface {
    _id: string
    chatName: string
    isGroupChat: boolean
    users: UserInterface[]
    latestMessage?: MessageInterface
    unseenMsgCount?: number
}


interface MessageInterface {
    sender:  UserInterface,
    message?: String,
    chat?: String,
    readBy?: String[],
    _id?: String,
    reference?: String,
    createdAt: Date | String,
    updatedAt?: String,
}

interface NotificationInterface {
    _id: string;
    chat: ChatInterface;
    count: number;
    message: MessageInterface; // ID of last message
    isRead?: boolean;
}


export type { UserInterface, ChatInterface, MessageInterface, NotificationInterface }