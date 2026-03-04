// types.ts
export interface Bank {
  id: string;
  name: string;
  code: string;
  short_name: string;
  icon_url?: string;
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  bankId: string;
}