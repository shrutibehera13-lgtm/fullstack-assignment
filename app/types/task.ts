export interface Task {
  _id: string;
  title: string;
  projectName: string;
  location: string;
  category: string;
  assignedTo: {_id:string , name:string};
  priority: 'low' | 'medium' | 'high';
  startDate: Date;
  endDate: Date;
  subtasks: Subtask[];
}

export interface Subtask extends Omit<Task, "subtasks" | "endDate" | "priority"> {
  dueDate: string,
  delay:string,
  reasonForDelay:string,
  images:string[],
  materialUsages:MaterialUsage[],
  machineryUsages:MachineryUsage[],
  manPowerUsages:ManPowerUsage[],
  status:"in progress" | "delayed" | 'completed'| 'not started'
}

export interface MaterialUsage {
  materialUsed: string;
  description: string;
}

export interface ManPowerUsage {
  workerName: string;
  role: string;
}

 export interface MachineryUsage {
  machineName: string;
  description: string;
}


export interface User {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  location: string;
}