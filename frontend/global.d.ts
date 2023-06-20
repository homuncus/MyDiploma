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

  export interface Netting {
    id: number,
    size: string,
    color: string,
    type: {
      id: number,
      name: string,
      slug: string
    },
  }

  export interface NettingType {
    id: number,
    name: string,
    slug: string,
    description: string
  }

  export interface Material {
    id: number,
    name: string,
    description: string,
    quantity: number
  }

  export interface Production {
    id: number,
    netting: Netting,
    chief: User,
    users: User[],
    material: Material,
    workshop: Workshop,
    completed: boolean,
    due_date: string
  }

  export interface User {
    id: number,
    email: string,
    username: string,
    about: string,
    pivot?: any
  }

  export interface Message {
    id: number,
    direction: string,
    message: string,
    sender_username: string,
    created_at: string
  }

  export interface Chat {
    id: number,
    username: string,
    last_message: string,
    last_message_date: string
  }
}