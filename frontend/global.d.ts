declare module 'nets-types' {
  export interface Workshop {
    id: number,
    name: string,
    slug: string,
    address: string,
    users_count: string
  }

  export interface User {
    id: number,
    email: string,
    username: string
  }
}