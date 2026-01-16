
export type EntryType = 'word' | 'idiom' | 'sentence';

export interface StudyEntry {
  id: string;
  text: string;
  translation: string;
  type: EntryType;
  date: string; // ISO String
  notes?: string;
}

export interface ChartDataPoint {
  date: string;
  count: number;
}
