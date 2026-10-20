// ─── Dashboard Data ───────────────────────────────────────────────────────────

export interface SalesRecord {
  id: string;
  date: string;          // YYYY-MM-DD
  category: string;
  product: string;
  revenue: number;
  units: number;
  region: string;
}

export interface MonthlyTrend {
  month: string;
  revenue: number;
  units: number;
  target: number;
}

export interface CategorySummary {
  category: string;
  revenue: number;
  units: number;
  share: number;
}

export interface RegionData {
  region: string;
  revenue: number;
  units: number;
}

export interface ScatterPoint {
  product: string;
  revenue: number;
  units: number;
  category: string;
}

// ─── Filters ─────────────────────────────────────────────────────────────────

export interface DashboardFilters {
  dateFrom: string;
  dateTo: string;
  category: string;
  region: string;
  search: string;
}

// ─── Usability Evaluation ────────────────────────────────────────────────────

export type TaskStatus = 'belum_dimulai' | 'selesai' | 'tidak_selesai';

export interface UsabilityTask {
  id: string;
  title: string;
  description: string;
  steps: string[];
}

export interface TaskResult {
  taskId: string;
  status: TaskStatus;
  timeSeconds: number | null;  // null = tidak diukur
  notes: string;
}

export interface EvaluationRating {
  kejelasanInformasi: number;    // 1-5
  kemudahanNavigasi: number;
  konsistensiElemen: number;
  keterbacaanGrafik: number;
  kejelasanFilter: number;
  komentarUmum: string;
}

export interface UsabilitySession {
  id: string;
  respondentName: string;
  respondentRole: string;
  timestamp: string;
  tasks: TaskResult[];
  ratings: EvaluationRating;
  phase: 'before' | 'after';
}

// ─── SUS ─────────────────────────────────────────────────────────────────────

export type SusAnswer = 1 | 2 | 3 | 4 | 5;

export interface SusResponse {
  id: string;
  respondentName: string;
  respondentRole: string;
  timestamp: string;
  answers: SusAnswer[];   // length === 10, index 0 = Q1
  score: number;
  phase: 'before' | 'after';
}

export interface SusItem {
  number: number;       // 1–10
  text: string;
  polarity: 'positive' | 'negative';  // odd = positive, even = negative
}

// ─── UCD ─────────────────────────────────────────────────────────────────────

export type IssueSeverity = 'rendah' | 'sedang' | 'tinggi';
export type IssueCategory = 'navigasi' | 'keterbacaan' | 'konsistensi' | 'visualisasi' | 'lainnya';

export interface UsabilityIssue {
  id: string;
  category: IssueCategory;
  severity: IssueSeverity;
  description: string;
  recommendation: string;
  timestamp: string;
}

export interface UcdStage {
  id: number;
  name: string;
  description: string;
  completed: boolean;
}

// ─── Results ─────────────────────────────────────────────────────────────────

export interface SusStats {
  count: number;
  mean: number | null;
  median: number | null;
  min: number | null;
  max: number | null;
  distribution: { range: string; count: number }[];
  grades: { grade: string; count: number }[];
}

export interface ComparisonResult {
  before: SusStats;
  after: SusStats;
  hasBeforeData: boolean;
  hasAfterData: boolean;
}

// ─── Storage Keys ─────────────────────────────────────────────────────────────

export const STORAGE_KEYS = {
  SUS_RESPONSES: 'usabilitylab_sus_responses',
  USABILITY_SESSIONS: 'usabilitylab_usability_sessions',
  ISSUES: 'usabilitylab_issues',
} as const;
