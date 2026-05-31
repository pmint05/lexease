import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { ConfigFontFamily } from "@/src/core/constants/fonts";
import {
  DisplaySettingsResponse,
  SaveDisplaySettingsRequest,
} from "@/src/core/types/config";
import { displaySettingsApi } from "@/src/data/api/displaySettingsApi";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useReadingStore } from "@/src/store/useReadingStore";

export const displaySettingsQueryKeys = {
  detail: (childId: string) => ["displaySettings", childId] as const,
};

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

const toConfigFontFamily = (fontFamily: string): ConfigFontFamily => {
  if (fontFamily === "OpenDyslexic" || fontFamily === "Lexend") {
    return fontFamily;
  }

  return "System";
};

export const normalizeDisplaySettings = (
  settings: SaveDisplaySettingsRequest,
): SaveDisplaySettingsRequest => {
  return {
    ...settings,
    fontSize: Math.round(clamp(settings.fontSize, 14, 40)),
    lineHeight: Number(clamp(settings.lineHeight, 1, 3).toFixed(2)),
    letterSpacing: Number(clamp(settings.letterSpacing, 0, 0.5).toFixed(2)),
    backgroundColor: settings.backgroundColor.toUpperCase(),
    textColor: settings.textColor.toUpperCase(),
    highlightBackgroundColor: settings.highlightBackgroundColor.toUpperCase(),
    highlightTextColor: settings.highlightTextColor.toUpperCase(),
  };
};

export const useDisplaySettingsQuery = (childId?: string) => {
  const token = useAuthStore((s) => s.token);
  const syncFromServer = useReadingStore((s) => s.syncFromServer);

  const query = useQuery({
    queryKey: displaySettingsQueryKeys.detail(childId ?? ""),
    queryFn: () => displaySettingsApi.getDisplaySettings(childId ?? ""),
    enabled: Boolean(token && childId),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (!query.data) return;

    syncFromServer({
      fontFamily: toConfigFontFamily(query.data.fontFamily),
      fontSize: query.data.fontSize,
      lineHeight: query.data.lineHeight,
      letterSpacing: query.data.letterSpacing * query.data.fontSize,
      backgroundColor: query.data.backgroundColor,
      textColor: query.data.textColor,
      highlightBackgroundColor: query.data.highlightBackgroundColor,
      highlightTextColor: query.data.highlightTextColor,
      highlightColor: query.data.highlightBackgroundColor,
    });
  }, [query.data, syncFromServer]);

  return query;
};

export const useSaveDisplaySettingsMutation = (childId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: SaveDisplaySettingsRequest) =>
      displaySettingsApi.saveDisplaySettings(
        childId,
        normalizeDisplaySettings(request),
      ),
    onSuccess: (settings: DisplaySettingsResponse) => {
      queryClient.setQueryData(
        displaySettingsQueryKeys.detail(settings.childId),
        settings,
      );
    },
  });
};

export const useResetDisplaySettingsMutation = (childId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => displaySettingsApi.resetDisplaySettings(childId),
    onSuccess: (settings: DisplaySettingsResponse) => {
      queryClient.setQueryData(
        displaySettingsQueryKeys.detail(settings.childId),
        settings,
      );
    },
  });
};
