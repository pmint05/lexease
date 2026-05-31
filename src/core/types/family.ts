export type GuardianChildLinkStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "REVOKED";

export interface GuardianChildLinkResponse {
  linkId: string;
  guardianId: string;
  childId: string;
  status: GuardianChildLinkStatus;
  childEmail?: string;
  guardianEmail?: string;
}

export interface CreateGuardianChildLinkRequest {
  childEmail: string;
}

