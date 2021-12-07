export type Record = {
  id: string;
  title: string;
  description?: string;
  caption?: string;
  color?: string;
  createdAt?: string;
  tags?: any[];
  taskStatus?: string;
  taskMembers?: any[];
  taskStartTime?: string;
  taskDueTime?: string;
  taskPriority?: number;
  taskEmoji?: string;
  subTaskList?: any[];
  relatedDocs?: any[];
  attachments?: any[];
  comments?: any;
};

export type Column = {
  id: string;
  title: string;
  description?: string;
  caption?: string;
  color?: string;
  records?: Record[];
  wipLimit?: number;
  wipEnabled?: boolean;
  createdAt?: string;
};
