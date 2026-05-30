import { Badge } from "@/src/components/ui/badge";
import { Card } from "@/src/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Text } from "@/src/components/ui/text";
import { useEffectiveTheme } from "@/src/hooks/useEffectiveTheme";
import { useGuardianChildLinksQuery } from "@/src/hooks/useFamilyQueries";
import { ChevronsUpDown } from "lucide-react-native";
import React from "react";
import { FlatList, Pressable, View } from "react-native";
import { useAuthStore } from "../../store/useAuthStore";
import { useFamilyStore } from "../../store/useFamilyStore";

type Props = {
  onChange?: (childId: string | null) => void;
};

export default function ChildSelector({ onChange }: Props) {
  const [open, setOpen] = React.useState(false);
  const user = useAuthStore((s) => s.user);
  const guardianId = user?.id ?? null;
  const { theme } = useEffectiveTheme();

  const getChildrenForGuardian = useFamilyStore(
    (s) => s.getChildrenForGuardian,
  );
  const getSelectedChildId = useFamilyStore((s) => s.getSelectedChildId);
  const setSelectedChild = useFamilyStore((s) => s.setSelectedChild);
  const linksQuery = useGuardianChildLinksQuery();

  if (!guardianId) return null;

  const backendLinks = (linksQuery.data ?? []).filter(
    (link) => link.guardianId === guardianId,
  );
  const acceptedLinks = backendLinks.filter(
    (link) => link.status === "ACCEPTED",
  );
  const children =
    backendLinks.length > 0
      ? acceptedLinks.map((link) => ({
          childId: link.childId,
          childName: `Bé ${link.childId.slice(0, 8)}`,
          childEmail: `${link.status.toLowerCase()} · ${link.childId.slice(0, 8)}`,
          status: link.status,
        }))
      : getChildrenForGuardian(guardianId).map((child) => ({
          ...child,
          status: "ACCEPTED" as const,
        }));
  const selectedChildId = getSelectedChildId(guardianId);
  const selectedChild =
    children.find((child) => child.childId === selectedChildId) ??
    children[0] ??
    null;

  const handleSelect = (childId: string) => {
    if (onChange) {
      onChange(childId);
    } else {
      setSelectedChild(guardianId, childId);
    }
    setOpen(false);
  };

  return (
    <View>
      <Text className="mb-2 text-sm text-muted-foreground">Bé đang xem</Text>

      {children.length === 0 ? (
        <Card className="p-4">
          <Text className="text-sm text-muted-foreground">
            {linksQuery.isLoading
              ? "Đang tải danh sách bé..."
              : backendLinks.length > 0
                ? "Chưa có liên kết nào được chấp nhận."
                : "Chưa có bé được liên kết."}
          </Text>
        </Card>
      ) : (
        <>
          <Pressable
            onPress={() => setOpen(true)}
            className="flex-row items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
            accessibilityRole="button"
            accessibilityLabel="Mở danh sách chọn bé"
          >
            <View className="flex-1 gap-1">
              <Text className="text-base font-semibold">
                {selectedChild?.childName ?? "Chọn bé"}
              </Text>
              <Text className="text-sm text-muted-foreground">
                {selectedChild?.childEmail ?? ""}
              </Text>
            </View>
            <ChevronsUpDown size={18} color={theme.mutedForeground} />
          </Pressable>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Chọn bé để xem thống kê</DialogTitle>
              </DialogHeader>

              <FlatList
                data={children}
                keyExtractor={(item) => item.childId}
                renderItem={({ item }) => {
                  const isActive = item.childId === selectedChildId;
                  const isAccepted = item.status === "ACCEPTED";

                  return (
                    <Pressable
                      onPress={() =>
                        isAccepted ? handleSelect(item.childId) : null
                      }
                      className={
                        isActive
                          ? "mb-2 rounded-xl border border-primary/30 bg-primary/10 p-3"
                          : "mb-2 rounded-xl border border-border bg-background p-3"
                      }
                      accessibilityRole="button"
                      accessibilityState={{ selected: isActive }}
                    >
                      <View className="flex-row items-center justify-between gap-2">
                        <View className="flex-1">
                          <Text className="text-sm font-semibold">
                            {item.childName}
                          </Text>
                          <Text className="mt-1 text-xs text-muted-foreground">
                            {item.childEmail}
                          </Text>
                        </View>
                        {!isAccepted ? (
                          <Badge variant="secondary">Chờ duyệt</Badge>
                        ) : null}
                      </View>
                    </Pressable>
                  );
                }}
              />
            </DialogContent>
          </Dialog>
        </>
      )}
    </View>
  );
}
