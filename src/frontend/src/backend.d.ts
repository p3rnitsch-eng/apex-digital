export interface Contact {
  name: string;
  email: string;
  message: string;
  timestamp: bigint;
}

export interface AdminDashboard {
  contacts: Contact[];
}
