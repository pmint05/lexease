import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Text } from "@/src/components/ui/text";
import { useEffectiveTheme } from "@/src/hooks/useEffectiveTheme";
import { useGuardianChildLinksQuery } from "@/src/hooks/useFamilyQueries";
import { cn } from "@/src/lib/utils";
import { Check, ChevronDown, User } from "lucide-react-native";
import React from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";
import { useAuthStore } from "../../store/useAuthStore";
import { useFamilyStore } from "../../store/useFamilyStore";

type Props = {
  onChange?: (childId: string | null) => void;
  className?: string;
};

export default function ChildSelector({ onChange, className }: Props) {
  const [open, setOpen] = React.useState(false);
  const user = useAuthStore((s) => s.user);
  const guardianId = user?.id ?? null;
  const { theme } = useEffectiveTheme();

  const getSelectedChildId = useFamilyStore((s) => s.getSelectedChildId);
  const setSelectedChild = useFamilyStore((s) => s.setSelectedChild);
  const linksQuery = useGuardianChildLinksQuery();

  if (!guardianId) return null;

  const acceptedLinks = (linksQuery.data ?? []).filter(
    (link) => link.guardianId === guardianId && link.status === "ACCEPTED",
  );

  const children = acceptedLinks.map((link) => ({
    childId: link.childId,
    childName:
      link.childEmail?.split("@")[0] || `Bé ${link.childId.slice(0, 4)}`,
    childEmail: link.childEmail,
  }));

  const selectedChildId = getSelectedChildId(guardianId);
  const selectedChild =
    children.find((child) => child.childId === selectedChildId) ??
    children[0] ??
    null;

  const handleSelect = (childId: string) => {
    setSelectedChild(guardianId, childId);
    if (onChange) onChange(childId);
    setOpen(false);
  };

  return (
    <View className={cn("flex-row items-center", className)}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Pressable
            className="flex-row items-center gap-1.5 px-3 py-1.5 bg-muted/20 rounded-full border border-border/40 active:bg-muted/40"
            accessibilityRole="button"
            accessibilityLabel="Chọn tài khoản bé"
          >
            <View className="size-6 bg-primary/10 rounded-full items-center justify-center">
              <User size={14} className="text-primary" />
            </View>
            <Text
              className="text-sm font-bold text-foreground"
              numberOfLines={1}
            >
              {selectedChild?.childName || "Chọn bé"}
            </Text>
            <ChevronDown size={14} className="text-muted-foreground" />
          </Pressable>
        </DialogTrigger>

        <DialogContent className="max-w-full sm:max-w-md p-0 overflow-hidden border-0 bg-background rounded-t-3xl sm:rounded-3xl bottom-0 left-0 right-0 absolute mx-auto slide-in-from-bottom-full rounded-b-none">
          <View className="p-6 pb-2">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl">Chọn bé đang xem</DialogTitle>
              <Text className="text-sm text-muted-foreground">
                Dữ liệu thống kê sẽ được hiển thị theo bé bạn chọn.
              </Text>
            </DialogHeader>
          </View>

          <View className="px-2 pb-6 max-h-[60vh]">
            {linksQuery.isLoading ? (
              <View className="py-10 items-center">
                <ActivityIndicator color={theme.primary} />
              </View>
            ) : children.length === 0 ? (
              <View className="py-10 items-center px-6">
                <Text className="text-center text-muted-foreground italic">
                  Bạn chưa có bé nào được liên kết thành công. Hãy vào mục Cài
                  đặt để kết nối nhé!
                </Text>
              </View>
            ) : (
              <FlatList
                data={children}
                keyExtractor={(item) => item.childId}
                contentContainerStyle={{ paddingHorizontal: 8 }}
                renderItem={({ item }) => {
                  const isActive = item.childId === selectedChildId;
                  return (
                    <Pressable
                      onPress={() => handleSelect(item.childId)}
                      className={cn(
                        "mb-3 flex-row items-center justify-between p-4 rounded-2xl border-2 transition-all",
                        isActive
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border bg-card active:bg-muted/10",
                      )}
                    >
                      <View className="flex-row items-center gap-3 flex-1">
                        <View
                          className={cn(
                            "size-10 rounded-full items-center justify-center",
                            isActive ? "bg-primary" : "bg-muted",
                          )}
                        >
                          <User
                            size={20}
                            color={isActive ? "white" : theme.mutedForeground}
                          />
                        </View>
                        <View className="flex-1">
                          <Text
                            className={cn(
                              "font-bold text-base",
                              isActive ? "text-primary" : "text-foreground",
                            )}
                          >
                            {item.childName}
                          </Text>
                          <Text
                            className="text-xs text-muted-foreground"
                            numberOfLines={1}
                          >
                            {item.childEmail}
                          </Text>
                        </View>
                      </View>
                      {isActive && (
                        <View className="size-6 bg-primary rounded-full items-center justify-center">
                          <Check size={14} color="white" strokeWidth={3} />
                        </View>
                      )}
                    </Pressable>
                  );
                }}
              />
            )}
          </View>
        </DialogContent>
      </Dialog>
    </View>
  );
}
