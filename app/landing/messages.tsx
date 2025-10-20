import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import React, { useMemo } from "react";
import {
  useGetMessages,
  useGetDirectMessages,
} from "@/api/messages/useFetchMessages";
import { useAuthStore } from "@/context/useAuthStore";
import { Message } from "@/types/Message";
import formatDate from "@/utils/FormatDate";

const Messages = () => {
  const { user_id } = useAuthStore();
  const {
    data: filteredMessages,
    isLoading: isLoadingFiltered,
    error: filteredError,
  } = useGetMessages(user_id || "");
  const {
    data: directMessages,
    isLoading: isLoadingDirect,
    error: directError,
  } = useGetDirectMessages(user_id || "");

  // Combine and sort all messages by creation date
  const allMessages = useMemo(() => {
    const filtered = filteredMessages || [];
    const direct = directMessages || [];

    const combined = [...filtered, ...direct];

    // Sort by creation date (newest first)
    return combined.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [filteredMessages, directMessages]);

  const isLoading = isLoadingFiltered || isLoadingDirect;
  const error = filteredError || directError;

  const renderItem = ({ item: item }: { item: Message }) => (
    <View style={styles.messageContainer}>
      <View style={styles.messageHeader}>
        <Image source={{ uri: item.image }} style={styles.thumbnail} />
        <View style={styles.headerTextContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{item.title}</Text>
            {item.recipients && item.recipients.length > 0 && (
              <View style={styles.directBadge}>
                <Text style={styles.directText}>Direct</Text>
              </View>
            )}
          </View>
          <View style={styles.categoryContainer}>
            <Text
              style={[
                styles.category,
                item.type === "Warning / Critical Notification" &&
                  styles.warning,
              ]}
            >
              {item.type}
            </Text>
            <Text style={styles.timestamp}>{formatDate(item.createdAt)}</Text>
          </View>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={styles.description}
          >
            {item.message}
          </Text>
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading messages</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={allMessages}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No messages available</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  messageContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  messageHeader: {
    flexDirection: "row",
  },
  thumbnail: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  headerTextContainer: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1B4965",
    flex: 1,
  },
  directBadge: {
    backgroundColor: "#e63946",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  directText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
  category: {
    fontSize: 12,
    color: "#1B4965",
  },
  warning: {
    color: "red",
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
  },
  description: {
    fontSize: 14,
    color: "#333",
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#e63946",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 60,
    backgroundColor: "#1B4965",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  navButton: {
    alignItems: "center",
  },
  navText: {
    color: "#fff",
    fontSize: 12,
  },
  composeButton: {
    backgroundColor: "#e63946",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  composeText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Messages;
