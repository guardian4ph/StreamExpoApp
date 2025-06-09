import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React from "react";
import {NotificationAlerts} from "@/types/Notifications";
import {useGetNotifications} from "@/api/notifications/useGetNotifications";
import {useAuthStore} from "@/context/useAuthStore";
import PagerView from "react-native-pager-view";

const {width} = Dimensions.get("window");

export default function AlertPost() {
  const {user_id} = useAuthStore();
  const {data: notifications, isLoading, error} = useGetNotifications(user_id!);

  const renderImages = (images: string[]) => {
    if (!images || images.length === 0) return null;

    return (
      <View style={styles.imageContainer}>
        <PagerView
          style={styles.pagerView}
          initialPage={0}
          orientation="horizontal">
          {images.map((image, index) => (
            <View key={index} style={styles.page}>
              <Image
                source={{uri: image}}
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

  const renderItem = ({item}: {item: NotificationAlerts}) => (
    <View style={styles.alertContainer}>
      <View style={styles.alertHeader}>
        <Image
          source={require("@/assets/images/emergencyMedical.png")}
          style={{width: 45, height: 45}}
          defaultSource={require("@/assets/images/emergencyMedical.png")}
        />
        <View>
          <Text style={styles.opCenter}>{item.type}</Text>
          <Text>{new Date(item.createdAt).toLocaleString()}</Text>
        </View>
      </View>
      <View style={{marginTop: 10}}>
        <Text style={styles.alertTitle}>{item.title}</Text>
        <Text style={{marginTop: 10}}>{item.message}</Text>
        {renderImages(item.images)}
      </View>
      <View style={styles.alertReact}>
        <TouchableOpacity style={{padding: 10}}>
          <Text>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{padding: 10}}>
          <Text>Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{padding: 10}}>
          <Text>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1B4965" />
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
    <View style={{flex: 1}}>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        initialNumToRender={2}
        maxToRenderPerBatch={1}
        windowSize={3}
        scrollEnabled={true}
        nestedScrollEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  alertContainer: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 10,
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  alertHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginTop: 5,
    borderBottomColor: "#eee",
  },
  opCenter: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#1B4965",
  },
  alertTitle: {
    fontWeight: "bold",
    color: "#1B4965",
    fontSize: 16,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  imageContainer: {
    marginVertical: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
  pagerView: {
    width: width - 30,
    height: 180,
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
  },
  alertImg: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
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
});
