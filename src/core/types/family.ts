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
}

export interface CreateGuardianChildLinkRequest {
  childEmail: string;
}

