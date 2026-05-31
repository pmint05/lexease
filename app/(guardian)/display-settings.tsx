import { Button } from "@/src/components/shared/Button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Separator } from "@/src/components/ui/separator";
import {
  Slider,
  SliderRange,
  SliderThumb,
  SliderTrack,
} from "@/src/components/ui/slider";
import { Text } from "@/src/components/ui/text";
import { ConfigFontFamily, FONT_MAP } from "@/src/core/constants/fonts";
import {
  useDisplaySettingsQuery,
  useResetDisplaySettingsMutation,
  useSaveDisplaySettingsMutation,
} from "@/src/hooks/useDisplaySettingsQueries";
import { useGuardianChildLinksQuery } from "@/src/hooks/useFamilyQueries";
import { cn } from "@/src/lib/utils";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useColorStore } from "@/src/store/useColorStore";
import { useFamilyStore } from "@/src/store/useFamilyStore";
import { useReadingStore } from "@/src/store/useReadingStore";
import { useRouter } from "expo-router";
import {
  AlignLeft,
  CaseLower,
  Check,
  ChevronDown,
  ChevronLeft,
  History,
  LetterText,
  Link2Off,
  Link as LinkIcon,
  Palette,
  Pipette,
  RotateCcw,
  Save,
  Search,
  Star,
  Type,
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { toast } from "sonner-native";

import ColorPicker, {
  HueSlider,
  OpacitySlider,
  Panel1,
} from "reanimated-color-picker";

// --- Color Helpers ---
function hexToRgba(hex: string): {
  r: number;
  g: number;
  b: number;
  a: number;
} {
  let r = 0,
    g = 0,
    b = 0,
    a = 1;
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else if (hex.length === 8) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
    a = parseInt(hex.substring(6, 8), 16) / 255;
  }
  return { r, g, b, a };
}

function rgbaToHex(r: number, g: number, b: number, a: number): string {
  const f = (n: number) =>
    Math.round(n).toString(16).padStart(2, "0").toUpperCase();
  const alphaHex = f(a * 255);
  return `#${f(r)}${f(g)}${f(b)}${alphaHex === "FF" ? "" : alphaHex}`;
}

const PREVIEW_TEXT =
  "Bé LexEase đang luyện đọc truyện cổ tích, với nhiều chữ cái tiếng Việt như â, ă, đ, ê, ô, ơ, ư! Đây là một ví dụ trực quan về giao diện đọc của trẻ.";

const THEME_PRESETS = [
  {
    name: "Kem & Xanh",
    bg: "#FFFDD0",
    text: "#000080",
    hBg: "#FFEB3B",
    hText: "#000080",
  },
  {
    name: "Vàng Nắng",
    bg: "#FFF9A6",
    text: "#333333",
    hBg: "#FFD700",
    hText: "#333333",
  },
  {
    name: "Cam Đào",
    bg: "#FCE6C9",
    text: "#1C1C1C",
    hBg: "#FFCC80",
    hText: "#1C1C1C",
  },
  {
    name: "Lục Bạc",
    bg: "#E2F0D9",
    text: "#4A2E1B",
    hBg: "#A9DFBF",
    hText: "#4A2E1B",
  },
  {
    name: "Xám Sâu",
    bg: "#EAEAEA",
    text: "#0A2540",
    hBg: "#B0BEC5",
    hText: "#0A2540",
  },
  {
    name: "Sáng",
    bg: "#FFF8F0",
    text: "#2D3436",
    hBg: "#FFD93D",
    hText: "#2D3436",
  },
  {
    name: "Tối",
    bg: "#1A1B1E",
    text: "#E9ECEF",
    hBg: "#4DABF7",
    hText: "#FFFFFF",
  },
  {
    name: "Dịu mắt",
    bg: "#F1F3F5",
    text: "#495057",
    hBg: "#82C91E",
    hText: "#FFFFFF",
  },
  {
    name: "Ấm áp",
    bg: "#FFF4E6",
    text: "#862E9C",
    hBg: "#FCC419",
    hText: "#FFFFFF",
  },
  {
    name: "Hải quân",
    bg: "#E7F5FF",
    text: "#1864AB",
    hBg: "#339AF0",
    hText: "#FFFFFF",
  },
  {
    name: "Kem",
    bg: "#FFFDD0",
    text: "#333333",
    hBg: "#FFEB3B",
    hText: "#333333",
  },
  {
    name: "Lục nhạt",
    bg: "#E8F5E9",
    text: "#1B5E20",
    hBg: "#C8E6C9",
    hText: "#1B5E20",
  },
  {
    name: "Lam dịu",
    bg: "#E0F7FA",
    text: "#01579B",
    hBg: "#B2EBF2",
    hText: "#01579B",
  },
  {
    name: "Cát hồng",
    bg: "#FDF2F2",
    text: "#4A4A4A",
    hBg: "#F9D5D3",
    hText: "#4A4A4A",
  },
];

export default function DisplaySettingsScreen(): React.ReactElement {
  const router = useRouter();
  const { user } = useAuthStore();
  const guardianId = user?.id ?? "";
  const { recentColors, addColor } = useColorStore();

  const selectedChildId = useFamilyStore((state) =>
    guardianId ? state.getSelectedChildId(guardianId) : null,
  );

  const linksQuery = useGuardianChildLinksQuery();
  const acceptedLinks = useMemo(() => {
    return (linksQuery.data ?? []).filter((link) => link.status === "ACCEPTED");
  }, [linksQuery.data]);

  const targetChildId = selectedChildId ?? acceptedLinks[0]?.childId ?? "";

  const initialSettings = useReadingStore();
  const [settings, setSettings] = useState({
    fontSize: initialSettings.fontSize,
    fontFamily: initialSettings.fontFamily,
    backgroundColor: initialSettings.backgroundColor,
    textColor: initialSettings.textColor,
    highlightBackgroundColor: initialSettings.highlightBackgroundColor,
    highlightTextColor: initialSettings.highlightTextColor,
    lineHeight: initialSettings.lineHeight,
    letterSpacing: initialSettings.letterSpacing,
  });

  const [syncHighlightText, setSyncHighlightText] = useState(true);

  const saveMutation = useSaveDisplaySettingsMutation(targetChildId);
  const resetMutation = useResetDisplaySettingsMutation(targetChildId);

  const { data: serverSettings } = useDisplaySettingsQuery(
    targetChildId || undefined,
  );

  useEffect(() => {
    if (serverSettings) {
      setSettings({
        fontSize: serverSettings.fontSize,
        fontFamily: serverSettings.fontFamily as ConfigFontFamily,
        backgroundColor: serverSettings.backgroundColor,
        textColor: serverSettings.textColor,
        highlightBackgroundColor: serverSettings.highlightBackgroundColor,
        highlightTextColor: serverSettings.highlightTextColor,
        lineHeight: serverSettings.lineHeight,
        letterSpacing: serverSettings.letterSpacing * serverSettings.fontSize,
      });
      if (serverSettings.textColor === serverSettings.highlightTextColor) {
        setSyncHighlightText(true);
      }
    }
  }, [serverSettings]);

  useEffect(() => {
    if (syncHighlightText) {
      setSettings((s) => ({ ...s, highlightTextColor: s.textColor }));
    }
  }, [settings.textColor, syncHighlightText]);

  const handleSave = () => {
    saveMutation.mutate(
      {
        ...settings,
        themeName: "custom",
        letterSpacing: settings.letterSpacing / settings.fontSize,
      },
      {
        onSuccess: () => {
          addColor(settings.backgroundColor);
          addColor(settings.textColor);
          addColor(settings.highlightBackgroundColor);
          if (!syncHighlightText) addColor(settings.highlightTextColor);
          toast.success("Đã lưu cấu hình thành công");
          router.back();
        },
        onError: () => {
          toast.error("Không thể lưu cấu hình. Vui lòng thử lại.");
        },
      },
    );
  };

  const handleReset = () => {
    resetMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Đã đặt lại cấu hình mặc định");
      },
      onError: () => {
        toast.error("Không thể đặt lại cấu hình.");
      },
    });
  };

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row justify-between items-center px-4 pt-4 pb-2 border-b border-border bg-card shadow-sm z-20">
        <Button
          variant="ghost"
          size="icon"
          onPress={() =>
            router.canGoBack()
              ? router.back()
              : router.replace("/(guardian)/(tabs)/settings")
          }
          className="rounded-full bg-muted/30"
        >
          <ChevronLeft size={24} className="text-foreground" />
        </Button>
        <Text className="text-lg font-bold">Cấu hình hiển thị</Text>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <RotateCcw size={20} className="text-muted-foreground" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Đặt lại mặc định?</AlertDialogTitle>
              <AlertDialogDescription>
                Tất cả các tùy chỉnh giao diện của bé sẽ được quay về trạng thái
                ban đầu của hệ thống.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                <Text>Hủy</Text>
              </AlertDialogCancel>
              <AlertDialogAction onPress={handleReset}>
                <Text>Xác nhận</Text>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </View>

      <View className="z-10 shadow-lg">
        <View
          style={{ backgroundColor: settings.backgroundColor }}
          className="p-6 border-b border-border/50 min-h-[160px] justify-center"
        >
          <Text
            className="text-[10px] uppercase font-bold mb-4 opacity-50"
            style={{ color: settings.textColor }}
          >
            Xem trước
          </Text>
          <View className="flex-row flex-wrap items-center max-h-[150px] overflow-y-auto">
            {PREVIEW_TEXT.split(" ").map((word, i) => {
              const isHighlighted = i === 1 || i === 2;
              return (
                <View
                  key={i}
                  style={{
                    backgroundColor: isHighlighted
                      ? settings.highlightBackgroundColor
                      : "transparent",
                    borderRadius: 6,
                    paddingHorizontal: 4,
                    paddingVertical: 2,
                    marginRight: 4,
                    marginBottom: 4,
                  }}
                >
                  <Text
                    style={{
                      fontFamily:
                        FONT_MAP[settings.fontFamily] || FONT_MAP.System,
                      fontSize: settings.fontSize,
                      color: isHighlighted
                        ? settings.highlightTextColor
                        : settings.textColor,
                      letterSpacing: settings.letterSpacing,
                      lineHeight: settings.fontSize * settings.lineHeight,
                      fontWeight: isHighlighted ? "700" : "400",
                    }}
                  >
                    {word}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4 gap-6 pb-32">
          <View className="gap-4">
            <View className="flex-row items-center gap-2">
              <Type size={18} className="text-primary" />
              <Text className="font-bold text-base">Kiểu chữ & Cỡ chữ</Text>
            </View>

            <Card className="border-border">
              <CardContent className="p-4 gap-6">
                <View className="gap-3">
                  <View className="flex-row items-center gap-2">
                    <CaseLower size={16} className="text-muted-foreground" />
                    <Text className="text-sm font-medium">
                      Cỡ chữ:{" "}
                      <Text className="text-primary font-bold">
                        {settings.fontSize}
                      </Text>
                    </Text>
                  </View>
                  <Slider
                    value={settings.fontSize}
                    onValueChange={(val) =>
                      setSettings((s) => ({
                        ...s,
                        fontSize: Math.round(val[0]),
                      }))
                    }
                    min={14}
                    max={40}
                    step={1}
                  >
                    <SliderTrack>
                      <SliderRange />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                </View>

                <View className="gap-2">
                  <Text className="text-sm font-medium">Phông chữ</Text>
                  <FontSelector
                    value={settings.fontFamily}
                    onSelect={(font) =>
                      setSettings((s) => ({ ...s, fontFamily: font }))
                    }
                  />
                </View>

                <View className="gap-3">
                  <View className="flex-row items-center gap-2">
                    <AlignLeft size={16} className="text-muted-foreground" />
                    <Text className="text-sm font-medium">
                      Khoảng cách dòng:{" "}
                      <Text className="text-primary font-bold">
                        {settings.lineHeight.toFixed(1)}
                      </Text>
                    </Text>
                  </View>
                  <Slider
                    value={settings.lineHeight}
                    onValueChange={(val) =>
                      setSettings((s) => ({ ...s, lineHeight: val[0] }))
                    }
                    min={1.0}
                    max={3.0}
                    step={0.1}
                  >
                    <SliderTrack>
                      <SliderRange />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                </View>

                <View className="gap-3">
                  <View className="flex-row items-center gap-2">
                    <LetterText size={16} className="text-muted-foreground" />
                    <Text className="text-sm font-medium">
                      Khoảng cách chữ:{" "}
                      <Text className="text-primary font-bold">
                        {settings.letterSpacing.toFixed(1)}px
                      </Text>
                    </Text>
                  </View>
                  <Slider
                    value={settings.letterSpacing}
                    onValueChange={(val) =>
                      setSettings((s) => ({ ...s, letterSpacing: val[0] }))
                    }
                    min={0}
                    max={10}
                    step={0.5}
                  >
                    <SliderTrack>
                      <SliderRange />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                </View>
              </CardContent>
            </Card>
          </View>

          <View className="gap-4">
            <View className="flex-row items-center gap-2">
              <Palette size={18} className="text-primary" />
              <Text className="font-bold text-base">Màu sắc chi tiết</Text>
            </View>

            <Card className="border-border">
              <CardContent className="p-4 gap-6">
                <ColorControl
                  label="Màu nền"
                  value={settings.backgroundColor}
                  onChange={(v) =>
                    setSettings((s) => ({ ...s, backgroundColor: v }))
                  }
                  recentColors={recentColors}
                />
                <Separator />
                <ColorControl
                  label="Màu chữ chính"
                  value={settings.textColor}
                  onChange={(v) => setSettings((s) => ({ ...s, textColor: v }))}
                  recentColors={recentColors}
                />
                <Separator />
                <ColorControl
                  label="Màu nền khi đang đọc"
                  value={settings.highlightBackgroundColor}
                  onChange={(v) =>
                    setSettings((s) => ({ ...s, highlightBackgroundColor: v }))
                  }
                  recentColors={recentColors}
                />
                <Separator />
                <View className="gap-3">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-sm font-medium">
                      Màu chữ khi đang đọc
                    </Text>
                    {!syncHighlightText ? (
                      <ColorControl
                        value={settings.highlightTextColor}
                        onChange={(v) =>
                          setSettings((s) => ({ ...s, highlightTextColor: v }))
                        }
                        recentColors={recentColors}
                      />
                    ) : (
                      <View className="p-3 bg-muted/20 rounded-xl border border-dashed border-border flex-row items-center gap-2">
                        <View
                          style={{ backgroundColor: settings.textColor }}
                          className="size-4 rounded-full border border-border"
                        />
                        <Text className="text-xs text-muted-foreground italic">
                          Dùng màu chữ chính
                        </Text>
                      </View>
                    )}
                  </View>
                  <Pressable
                    onPress={() => setSyncHighlightText(!syncHighlightText)}
                    className="flex-row items-center gap-1.5"
                  >
                    {syncHighlightText ? (
                      <LinkIcon size={14} className="text-primary" />
                    ) : (
                      <Link2Off size={14} className="text-muted-foreground" />
                    )}
                    <Text
                      className={cn(
                        "text-xs font-bold",
                        syncHighlightText
                          ? "text-primary"
                          : "text-muted-foreground",
                      )}
                    >
                      {syncHighlightText ? "Đang đồng bộ" : "Tự chọn"}
                    </Text>
                  </Pressable>
                </View>
              </CardContent>
            </Card>
          </View>

          <View className="gap-4">
            <View className="flex-row items-center gap-2">
              <Star size={18} className="text-primary" />
              <Text className="font-bold text-base">Bộ chủ đề gợi ý</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-3">
                {THEME_PRESETS.map((t, idx) => (
                  <Pressable
                    key={idx}
                    onPress={() => {
                      setSettings((s) => ({
                        ...s,
                        backgroundColor: t.bg,
                        textColor: t.text,
                        highlightBackgroundColor: t.hBg,
                        highlightTextColor: t.hText,
                      }));
                      setSyncHighlightText(t.text === t.hText);
                    }}
                    className={cn(
                      "p-3 rounded-2xl border-2 items-center gap-2 w-24",
                      settings.backgroundColor === t.bg &&
                        settings.textColor === t.text
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card",
                    )}
                  >
                    <View
                      style={{ backgroundColor: t.bg }}
                      className="size-10 rounded-full border border-border shadow-inner items-center justify-center"
                    >
                      <Text
                        style={{ color: t.text }}
                        className="text-xs font-bold"
                      >
                        Aa
                      </Text>
                    </View>
                    <Text className="text-xs font-bold" numberOfLines={1}>
                      {t.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border">
        <Button
          className="w-full h-14 rounded-2xl"
          onPress={handleSave}
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Save size={20} className="text-primary-foreground mr-2" />
              <Text className="text-lg font-bold">Lưu thay đổi</Text>
            </>
          )}
        </Button>
      </View>
    </View>
  );
}

function ColorControl({
  label,
  value,
  onChange,
  recentColors,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  recentColors: string[];
}) {
  return (
    <View className="gap-3">
      <View className="flex-row items-center gap-3 justify-between">
        {label && <Text className="text-sm font-medium">{label}</Text>}
        <Dialog>
          <DialogTrigger asChild>
            <Pressable className="flex-row items-center gap-2 px-3 py-2 bg-muted/20 rounded-xl border border-border/50">
              <View
                style={{ backgroundColor: value }}
                className="size-6 rounded-md border border-border"
              />
              <Text className="text-xs font-mono font-bold uppercase">
                {value}
              </Text>
              <Pipette size={14} className="text-muted-foreground" />
            </Pressable>
          </DialogTrigger>
          <DialogContent className="max-w-full sm:max-w-md p-0 overflow-hidden border-0 bg-background rounded-t-3xl sm:rounded-3xl bottom-0 left-0 right-0 absolute mx-auto slide-in-from-bottom-full rounded-b-none">
            <View className="p-6 gap-6">
              <DialogHeader>
                <DialogTitle>Tùy chỉnh màu sắc</DialogTitle>
              </DialogHeader>

              <ColorPicker
                value={value}
                onComplete={(v) => onChange(v.hex)}
                style={{ gap: 20 }}
              >
                <Panel1 style={{ height: 200, borderRadius: 16 }} />
                <HueSlider style={{ borderRadius: 8 }} />
                <OpacitySlider style={{ borderRadius: 8 }} />
              </ColorPicker>

              {recentColors.length > 0 && (
                <View className="gap-2">
                  <View className="flex-row items-center gap-2">
                    <History size={14} className="text-muted-foreground" />
                    <Text className="text-xs font-bold text-muted-foreground uppercase">
                      Gần đây
                    </Text>
                  </View>
                  <View className="flex-row flex-wrap gap-2">
                    {recentColors.map((c, i) => (
                      <Pressable
                        key={i}
                        onPress={() => onChange(c)}
                        style={{ backgroundColor: c }}
                        className="size-8 rounded-full border border-border shadow-sm"
                      />
                    ))}
                  </View>
                </View>
              )}

              <DialogClose asChild>
                <Button
                  className="w-full rounded-xl mt-2"
                  variant="outline"
                  onPress={() => onChange(value)}
                >
                  <Text>Xong</Text>
                </Button>
              </DialogClose>
            </View>
          </DialogContent>
        </Dialog>
      </View>
    </View>
  );
}

function FontSelector({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (v: ConfigFontFamily) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const fonts = [
    {
      id: "Lexend",
      name: "Lexend (Mặc định)",
      description: "Dễ đọc, hiện đại",
    },
    {
      id: "OpenDyslexic",
      name: "OpenDyslexic",
      description: "Hỗ trợ trẻ khó đọc",
    },
    { id: "System", name: "System Serif", description: "Phông chữ hệ thống" },
  ];
  const filteredFonts = fonts.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Pressable className="flex-row items-center justify-between p-4 bg-muted/20 rounded-xl border border-border/50">
          <Text className="font-bold text-foreground">{value}</Text>
          <ChevronDown size={16} className="text-muted-foreground" />
        </Pressable>
      </DialogTrigger>
      <DialogContent className="max-w-full sm:max-w-md p-0 overflow-hidden border-0 bg-background rounded-t-3xl sm:rounded-3xl bottom-0 left-0 right-0 absolute mx-auto slide-in-from-bottom-full rounded-b-none">
        <View className="p-6">
          <DialogHeader className="mb-4">
            <DialogTitle>Chọn phông chữ</DialogTitle>
          </DialogHeader>
          <View className="relative mb-4">
            <Input
              placeholder="Tìm kiếm phông chữ..."
              value={search}
              onChangeText={setSearch}
              className="pl-10"
            />
            <Search
              size={18}
              className="absolute left-3 top-3 text-muted-foreground"
            />
          </View>
          <View className="max-h-[40vh]">
            <FlatList
              data={filteredFonts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const isActive = item.id === value;
                return (
                  <Pressable
                    onPress={() => {
                      onSelect(item.id as ConfigFontFamily);
                      setOpen(false);
                    }}
                    className={cn(
                      "mb-3 p-4 rounded-2xl border-2 flex-row items-center justify-between",
                      isActive
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card",
                    )}
                  >
                    <View>
                      <Text
                        style={{
                          fontFamily: FONT_MAP[item.id as ConfigFontFamily],
                        }}
                        className={cn(
                          "text-lg",
                          isActive ? "text-primary" : "text-foreground",
                        )}
                      >
                        {item.name}
                      </Text>
                      <Text className="text-xs text-muted-foreground">
                        {item.description}
                      </Text>
                    </View>
                    {isActive && <Check size={20} className="text-primary" />}
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      </DialogContent>
    </Dialog>
  );
}
