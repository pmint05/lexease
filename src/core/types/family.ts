export type GuardianChildLinkStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "REVOKED";

export interface ChildInfo {
  id: string;
  email: string;
  displayName?: string;
  role: string;
  status: string;
}

export interface GuardianChildLinkResponse {
  linkId: string;
  guardianId: string;
  childId: string;
  status: GuardianChildLinkStatus;
  childEmail?: string;
  guardianEmail?: string;
  child?: ChildInfo;
}

export interface CreateGuardianChildLinkRequest {
  childEmail: string;
}

