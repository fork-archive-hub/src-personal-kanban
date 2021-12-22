/** 看板中一个卡片的类型 */
export type Record = {
  id: string;
  cardTitle: string;
  cardTitleEmoji?: string;
  desc?: string;
  status?: string;
  priority?: string;
  caption?: string;
  color?: string;
  createdAt?: string;
  cardLabels?: any[];
  cardMembers?: any[];
  cardChecklists?: any[];
  cardRelatedDocs?: any[];
  cardStartTime?: string;
  cardDueTime?: string;
  attachments?: any[];
  comments?: any;
};

/** 看板中一个分组列的类型 */
export type Column = {
  id: string;
  listGroupTitle: string;
  cardsRecords?: Record[];
  desc?: string;
  caption?: string;
  color?: string;
  wipLimit?: number;
  wipEnabled?: boolean;
  createdAt?: string;
};
