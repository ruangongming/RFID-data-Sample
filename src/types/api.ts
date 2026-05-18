// API Request and Response Types for Simple RFID Integration

// Print Job API
export interface PrintJobLabel {
  name: string;
  prod_code: string;
  serial: string;
  epc: string;
}

export interface PrintJobRequest {
  session_print: string;
  session_name: string;
  date_created: string;
  select_temp: string;
  rfid_enable: boolean;
  labels: PrintJobLabel[];
}

export interface PrintJobResponse {
  respcode: string;
  errmsg: string;
  print_job_id: string;
}

// Stock Out API
export interface StockOutItem {
  asset_id: string;
  epc: string;
}

export interface StockOutRequest {
  stockout_code: string;
  stockout_name: string;
  created_at: string;
  warehouse_cd: string;
  warehouse_name: string;
  person_cd: string;
  person_name: string;
  department: string;
  items: StockOutItem[];
}

export interface StockOutResponse {
  respcode: string;
  errmsg: string;
  stockout_id: string;
}

// Stock In API
export interface StockInItem {
  asset_id: string;
  epc: string;
}

export interface StockInRequest {
  stockin_code: string;
  stockin_name: string;
  created_at: string;
  warehouse_cd: string;
  warehouse_name: string;
  sender_person_cd: string;
  sender_person_name: string;
  sender_department: string;
  items: StockInItem[];
}

export interface StockInResponse {
  respcode: string;
  errmsg: string;
  stockin_id: string;
}

// Audit Session API
export interface AuditItem {
  asset_id: string;
  serial: string;
  epc?: string | null;
}

export interface AuditSessionRequest {
  session_audit: string;
  session_name: string;
  method: string;
  date_created: string;
  user_request: string;
  department_info: string;
  store_info: string;
  items: AuditItem[];
}

export interface AuditSessionResponse {
  respcode: string;
  errmsg: string;
  audit_id: string;
}

// History Log Types
export type SessionType = "print" | "stockout" | "stockin" | "audit";

export interface HistoryEntry {
  id: string;
  session_code: string;
  type: SessionType;
  timestamp: string;
  status: "success" | "error";
  request: any;
  response: any;
}