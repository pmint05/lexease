import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { User } from "../core/types";

export interface ChildLink {
  id: string;
  guardianId: string;
  childId: string;
  childEmail: string;
  childName: string;
  linkedAt: string;
  displaySettings?: {
    fontSize: number;
    backgroundColor: string;
    letterSpacing: number;
    lineSpacing: number;
  };
}

export interface ChildDocument {
  id: string;
  guardianId: string;
  childId: string;
  fileName: string;
  fileUri: string;
  mimeType?: string;
  sizeBytes?: number;
  uploadedAt: string;
}

interface LinkResult {
  success: boolean;
  error?: string;
}

interface FamilyStoreState {
  childLinks: ChildLink[];
  documents: ChildDocument[];
  selectedChildByGuardian: Record<string, string | null>;
  ensureDemoChildrenForGuardian: (guardianId: string) => void;
  linkChild: (params: { guardianId: string; childUser: User }) => LinkResult;
  setSelectedChild: (guardianId: string, childId: string | null) => void;
  addDocument: (params: {
    guardianId: string;
    childId: string;
    fileName: string;
    fileUri: string;
    mimeType?: string;
    sizeBytes?: number;
  }) => void;
  removeDocument: (documentId: string) => void;
  getChildrenForGuardian: (guardianId: string) => ChildLink[];
  getSelectedChildId: (guardianId: string) => string | null;
  getDocumentsForChild: (
    guardianId: string,
    childId: string,
  ) => ChildDocument[];
  updateChildName: (guardianId: string, childId: string, name: string) => void;
  setChildDisplaySettings: (
    guardianId: string,
    childId: string,
    settings: {
      fontSize?: number;
      backgroundColor?: string;
      letterSpacing?: number;
      lineSpacing?: number;
    },
  ) => void;
}

const SAMPLE_CHILD_LINKS: ChildLink[] = [
  {
    id: "link-1",
    guardianId: "guardian-1",
    childId: "child-1",
    childEmail: "child1@gmail.com",
    childName: "Bé Thứ Nhất",
    linkedAt: new Date().toISOString(),
    displaySettings: {
      fontSize: 18,
      backgroundColor: "#FFF8F0",
      letterSpacing: 1.2,
      lineSpacing: 1.4,
    },
  },
  {
    id: "link-2",
    guardianId: "guardian-1",
    childId: "child-2",
    childEmail: "child2@gmail.com",
    childName: "Bé Thứ Hai",
    linkedAt: new Date().toISOString(),
    displaySettings: {
      fontSize: 20,
      backgroundColor: "#F0F8FF",
      letterSpacing: 1.4,
      lineSpacing: 1.6,
    },
  },
];

const DEMO_CHILD_TEMPLATES: Omit<
  ChildLink,
  "id" | "guardianId" | "linkedAt"
>[] = [
  {
    childId: "child-1",
    childEmail: "child1@gmail.com",
    childName: "Bé Thứ Nhất",
    displaySettings: {
      fontSize: 18,
      backgroundColor: "#FFF8F0",
      letterSpacing: 1.2,
      lineSpacing: 1.4,
    },
  },
  {
    childId: "child-2",
    childEmail: "child2@gmail.com",
    childName: "Bé Thứ Hai",
    displaySettings: {
      fontSize: 20,
      backgroundColor: "#F0F8FF",
      letterSpacing: 1.4,
      lineSpacing: 1.6,
    },
  },
  {
    childId: "child-3",
    childEmail: "child3@gmail.com",
    childName: "Bé Thứ Ba",
    displaySettings: {
      fontSize: 19,
      backgroundColor: "#F7FFF0",
      letterSpacing: 1.3,
      lineSpacing: 1.5,
    },
  },
  {
    childId: "child-4",
    childEmail: "child4@gmail.com",
    childName: "Bé Thứ Tư",
    displaySettings: {
      fontSize: 18,
      backgroundColor: "#FFF4FA",
      letterSpacing: 1.2,
      lineSpacing: 1.5,
    },
  },
];

export const useFamilyStore = create<FamilyStoreState>()(
  persist(
    (set, get) => ({
      childLinks: SAMPLE_CHILD_LINKS,
      documents: [],
      selectedChildByGuardian: { "guardian-1": "child-1" },
      ensureDemoChildrenForGuardian: (guardianId: string) =>
        set((state) => {
          const guardianChildren = state.childLinks.filter(
            (link) => link.guardianId === guardianId,
          );
          const existingForGuardian = new Set(
            guardianChildren.map((link) => link.childId),
          );
          const existingGlobal = new Set(
            state.childLinks.map((link) => link.childId),
          );

          const additions: ChildLink[] = DEMO_CHILD_TEMPLATES.filter(
            (tpl) =>
              !existingForGuardian.has(tpl.childId) &&
              (!existingGlobal.has(tpl.childId) ||
                state.childLinks.some(
                  (link) =>
                    link.guardianId === guardianId &&
                    link.childId === tpl.childId,
                )),
          ).map((tpl, index) => ({
            id: `demo-link-${guardianId}-${tpl.childId}-${index}`,
            guardianId,
            childId: tpl.childId,
            childEmail: tpl.childEmail,
            childName: tpl.childName,
            linkedAt: new Date().toISOString(),
            displaySettings: tpl.displaySettings,
          }));

          if (additions.length === 0) {
            return state;
          }

          const currentSelected =
            state.selectedChildByGuardian[guardianId] ?? null;
          return {
            childLinks: [...additions, ...state.childLinks],
            selectedChildByGuardian: {
              ...state.selectedChildByGuardian,
              [guardianId]: currentSelected ?? additions[0].childId,
            },
          };
        }),
      linkChild: ({ guardianId, childUser }) => {
        if (childUser.role !== "child") {
          return {
            success: false,
            error: "Email này không thuộc tài khoản bé",
          };
        }

        const existingOwner = get().childLinks.find(
          (link) => link.childId === childUser.id,
        );

        if (existingOwner && existingOwner.guardianId !== guardianId) {
          return {
            success: false,
            error: "Bé này đã được liên kết với phụ huynh khác",
          };
        }

        const alreadyLinked = get().childLinks.some(
          (link) =>
            link.guardianId === guardianId && link.childId === childUser.id,
        );

        if (alreadyLinked) {
          return {
            success: false,
            error: "Bé này đã có trong danh sách của bạn",
          };
        }

        const nextLink: ChildLink = {
          id: `link-${Date.now()}`,
          guardianId,
          childId: childUser.id,
          childEmail: childUser.email,
          childName: childUser.name,
          linkedAt: new Date().toISOString(),
        };

        set((state) => ({
          childLinks: [nextLink, ...state.childLinks],
          selectedChildByGuardian: {
            ...state.selectedChildByGuardian,
            [guardianId]:
              state.selectedChildByGuardian[guardianId] ?? childUser.id,
          },
        }));

        return { success: true };
      },
      setSelectedChild: (guardianId, childId) =>
        set((state) => ({
          selectedChildByGuardian: {
            ...state.selectedChildByGuardian,
            [guardianId]: childId,
          },
        })),
      updateChildName: (guardianId, childId, name) =>
        set((state) => ({
          childLinks: state.childLinks.map((link) =>
            link.guardianId === guardianId && link.childId === childId
              ? { ...link, childName: name }
              : link,
          ),
        })),
      setChildDisplaySettings: (guardianId, childId, settings) =>
        set((state) => ({
          childLinks: state.childLinks.map((link) =>
            link.guardianId === guardianId && link.childId === childId
              ? {
                  ...link,
                  displaySettings: {
                    fontSize:
                      settings.fontSize ?? link.displaySettings?.fontSize ?? 16,
                    backgroundColor:
                      settings.backgroundColor ??
                      link.displaySettings?.backgroundColor ??
                      "#FFF8F0",
                    letterSpacing:
                      settings.letterSpacing ??
                      link.displaySettings?.letterSpacing ??
                      1.2,
                    lineSpacing:
                      settings.lineSpacing ??
                      link.displaySettings?.lineSpacing ??
                      1.5,
                  },
                }
              : link,
          ),
        })),
      addDocument: ({
        guardianId,
        childId,
        fileName,
        fileUri,
        mimeType,
        sizeBytes,
      }) =>
        set((state) => ({
          documents: [
            {
              id: `doc-${Date.now()}`,
              guardianId,
              childId,
              fileName,
              fileUri,
              mimeType,
              sizeBytes,
              uploadedAt: new Date().toISOString(),
            },
            ...state.documents,
          ],
        })),
      removeDocument: (documentId) =>
        set((state) => ({
          documents: state.documents.filter((doc) => doc.id !== documentId),
        })),
      getChildrenForGuardian: (guardianId) =>
        get().childLinks.filter((link) => link.guardianId === guardianId),
      getSelectedChildId: (guardianId) =>
        get().selectedChildByGuardian[guardianId] ?? null,
      getDocumentsForChild: (guardianId, childId) =>
        get().documents.filter(
          (doc) => doc.guardianId === guardianId && doc.childId === childId,
        ),
    }),
    {
      name: "lexease-family",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
