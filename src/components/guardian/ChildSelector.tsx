import { ChevronsUpDown } from "lucide-react-native";
import React from "react";
import {
    FlatList,
    Modal,
    Pressable,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { useGuardianChildLinksQuery } from "@/src/hooks/useFamilyQueries";
import { useAuthStore } from "../../store/useAuthStore";
import { useFamilyStore } from "../../store/useFamilyStore";

type Props = {
  onChange?: (childId: string | null) => void;
};

export default function ChildSelector({ onChange }: Props) {
  const [open, setOpen] = React.useState(false);
  const user = useAuthStore((s) => s.user);
  const guardianId = user?.id ?? null;

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
      <Text style={{ fontSize: 14, color: "#666", marginBottom: 6 }}>
        Bé đang xem
      </Text>

      {children.length === 0 ? (
        <View
          style={{
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "#EEE",
            borderRadius: 12,
            padding: 12,
          }}
        >
          <Text style={{ fontSize: 14, color: "#999" }}>
            {linksQuery.isLoading
              ? "Đang tải danh sách bé..."
              : backendLinks.length > 0
                ? "Chưa có liên kết nào được chấp nhận."
                : "Chưa có bé được liên kết."}
          </Text>
        </View>
      ) : (
        <>
          <Pressable
            onPress={() => setOpen(true)}
            style={{
              backgroundColor: "#fff",
              borderWidth: 1,
              borderColor: "#EAEAEA",
              borderRadius: 12,
              padding: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            accessibilityRole="button"
            accessibilityLabel="Mở danh sách chọn bé"
          >
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                }}
              >
                {selectedChild?.childName ?? "Chọn bé"}
              </Text>
              <Text style={{ fontSize: 12, color: "#777", marginTop: 2 }}>
                {selectedChild?.childEmail ?? ""}
              </Text>
            </View>
            <ChevronsUpDown size={18} color="#555" />
          </Pressable>

          <Modal
            visible={open}
            transparent
            animationType="slide"
            onRequestClose={() => setOpen(false)}
          >
            <TouchableWithoutFeedback onPress={() => setOpen(false)}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: "rgba(0,0,0,0.3)",
                  justifyContent: "flex-end",
                }}
              >
                <TouchableWithoutFeedback>
                  <View
                    style={{
                      backgroundColor: "#fff",
                      borderTopLeftRadius: 16,
                      borderTopRightRadius: 16,
                      padding: 14,
                      maxHeight: "60%",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "700",
                        marginBottom: 10,
                      }}
                    >
                      Chọn bé để xem thống kê
                    </Text>

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
                            style={{
                              paddingVertical: 12,
                              paddingHorizontal: 10,
                              borderRadius: 10,
                              backgroundColor: isActive ? "#EEF6FF" : "#fff",
                              borderWidth: 1,
                              borderColor: isActive ? "#CFE6FF" : "#F0F0F0",
                              marginBottom: 8,
                              opacity: isAccepted ? 1 : 0.55,
                            }}
                            accessibilityRole="button"
                            accessibilityState={{ selected: isActive }}
                          >
                            <Text style={{ fontSize: 15, fontWeight: "700" }}>
                              {item.childName}
                            </Text>
                            <Text
                              style={{
                                fontSize: 12,
                                color: "#777",
                                marginTop: 2,
                              }}
                            >
                              {item.childEmail}
                            </Text>
                          </Pressable>
                        );
                      }}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </>
      )}
    </View>
  );
}
