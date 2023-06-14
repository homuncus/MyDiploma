declare module 'nets-types' {
  export interface Workshop {
    id: number,
    name: string,
    slug: string,
    address: string,
    users_count: string,
    created_at: string,
    updated_at: string
  }

  export interface User {
    id: number,
    email: string,
    username: string
  }

  export interface Message {
    id: number,
    receiever: User,
    sender: User,
    message: string,
    read: boolean,
    created_at: string
  }

  export interface Chat {
    id: number,
    interlocutor: User,
    lastMessage: Message
  }
}