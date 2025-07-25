import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
} from "react-native";
import React, { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { NotificationAlerts } from "@/types/Notifications";
import { useGetNotifications } from "@/api/notifications/useGetNotifications";
import { useAuthStore } from "@/context/useAuthStore";
import PagerView from "react-native-pager-view";
import moment from "moment";

const { width } = Dimensions.get("window");

const timeDifference = (item) => {
  var current = new Date();
  var formatDate = new Date(item);

  var minutes = 60 * 1000;
  var hours = minutes * 60;
  var days = hours * 24;
  var months = days * 30;
  var years = days * 365;

  var elapsed = current - formatDate;

  if (elapsed < minutes) {
    return Math.round(elapsed / 1000) + " seconds ago";
  } else if (elapsed < hours) {
    return Math.round(elapsed / minutes) + " minutes ago";
  } else if (elapsed < days) {
    return Math.round(elapsed / hours) + " hours ago";
  } else if (elapsed < months) {
    return Math.round(elapsed / days) + " days ago";
  } else if (elapsed < years) {
    return Math.round(elapsed / months) + " months ago";
  } else {
    return Math.round(elapsed / years) + " years ago";
  }
};

export default function AlertPost() {
  const { user_id } = useAuthStore();
  const {
    data: notifications,
    isLoading,
    error,
    // refetch,
    // isRefetching,
  } = useGetNotifications(user_id!);

  // useFocusEffect(
  //   useCallback(() => {
  //     refetch();
  //   }, [refetch])
  // );

  const renderImages = (images: string[]) => {
    if (!images || images.length === 0) return null;

    return (
      <View style={styles.imageContainer}>
        <PagerView
          style={styles.pagerView}
          initialPage={0}
          orientation="horizontal"
        >
          {images.map((image, index) => (
            <View key={index} style={styles.page}>
              <Image
                source={{ uri: image }}
                style={styles.alertImg}
                defaultSource={require("@/assets/images/userAvatar.png")}
                resizeMode="cover"
              />
            </View>
          ))}
        </PagerView>
        {images.length > 1 && (
          <View style={styles.paginationContainer}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === 0 && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderItem = ({ item }: { item: NotificationAlerts }) => (
    //  { console.log ("Item", item)},
    <View style={styles.alertContainer}>
      <View style={styles.alertHeader}>
        <Image
          source={require("@/assets/images/Cebu.png")}
          style={styles.notifBadge}
          defaultSource={require("@/assets/images/emergencyMedical.png")}
        />
        <View>
          <Text style={styles.opCenter}>{item.type}</Text>
          <Text style={styles.date}>
            {moment(item.createdAt)
              .format("MMMM D, YYYY, h:mm:ss")
              .toLocaleString()}
            {" | "}
            {timeDifference(item.createdAt)}
          </Text>
        </View>
      </View>
      <View style={{ marginTop: 10 }}>
        <Text style={styles.alertTitle}>{item.title}</Text>
        <Text style={styles.alertMessage}>{item.message}</Text>
        {renderImages(item.images)}
      </View>
      <View style={styles.alertReact}>
        <TouchableOpacity>
          <Text style={styles.alertMessage}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.alertMessage}>Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.alertMessage}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#215a75" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load notifications</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        initialNumToRender={2}
        maxToRenderPerBatch={1}
        windowSize={3}
        scrollEnabled={true}
        nestedScrollEnabled={true}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={isRefetching}
        //     onRefresh={refetch}
        //     colors={["#215a75"]}
        //     tintColor="#215a75"
        //   />
        // }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  alertContainer: {
    flex: 1,
    alignContent: "center",
    backgroundColor: "#fff",
    marginTop: 8,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1.5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.84,
    elevation: 2,
  },
  alertHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginTop: 2,

    borderBottomColor: "#eee",
  },
  opCenter: {
    fontWeight: "500",
    fontSize: 14,
    color: "#215a75",
    textTransform: "uppercase",
  },
  date: {
    fontWeight: "500",
    fontSize: 8,
    color: "#ddd",
  },
  alertTitle: {
    fontWeight: "500",
    color: "#215a75",
    fontSize: 14,
    letterSpacing: 0.2,
    textTransform: "uppercase",
    marginLeft: 10,
  },
  alertMessage: {
    fontWeight: "300",
    color: "#333",
    fontSize: 12,
    letterSpacing: 0.2,
    marginLeft: 10,
  },
  imageContainer: {
    marginVertical: 10,

    overflow: "hidden",
  },
  pagerView: {
    width: width,
    height: 350,
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
  },
  alertImg: {
    width: "100%",
    height: "100%",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 10,
    width: "100%",
  },
  paginationDot: {
    width: 4,
    height: 4,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#fff",
    width: 4,
    height: 4,
    borderRadius: 5,
  },
  alertReact: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#ff0000",
    fontSize: 16,
    textAlign: "center",
  },
  notifBadge: {
    width: 50,
    height: 50,
    marginLeft: 10,
    borderRadius: 100,

    backgroundColor: "#fff",

    // iOS shadow
    shadowColor: "#222",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 9,

    // Android shadow
    elevation: 8,
  },
});
