interface Item {
  '@id': string;
  '@type': string;
  modified?: string;
  created?: string;
  description: string;
  review_state: string | null;
  title: string;
}

export interface Search {
  '@id'?: string;
  batching?: Batching;
  items: Item[];
  items_total: number;
}
