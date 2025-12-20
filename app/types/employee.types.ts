export interface Employee {
  _id: string;
  name: string;
  role: Role;
  isSkilled: boolean;
  email: string;
}

export type Role = "labour" | "engineer" | "supervisor";

export interface Labour extends Employee {
  role: "labour";
}
