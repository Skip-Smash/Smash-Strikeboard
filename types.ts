
export interface Employee {
  id: string;
  name: string;
  strikes: number;
  reasons: string[];
}

export interface StrikeHistory {
  employeeName: string;
  reason: string;
  timestamp: number;
}
