import React from "react";
import {View, Text, Image, StyleSheet} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import {Incident} from "@/types/incidents";
import {useGetDispatcher} from "@/api/dispatcher/useGetDispatcher";

interface IncidentDispatcherSectionProps {
  incidentState: Incident | null;
}

const IncidentDispatcherSection = ({
  incidentState,
}: IncidentDispatcherSectionProps) => {
  const router = useRouter();
  const {data: dispatcher, isLoading: isDispatcherLoading} = useGetDispatcher(
    incidentState?.dispatcher as string
  );

  return (
    <View style={styles.headerSection}>
      <View style={styles.headerRow}>
        <Image
          source={require("@/assets/images/avatar.png")}
          resizeMode="contain"
          style={styles.logoImage}
        />
        <View style={styles.headerText}>
          <View style={styles.statusRow}>
            <View>
              <Text style={styles.dispatcherName}>
                {dispatcher?.firstName} {dispatcher?.lastName}
              </Text>
              <Text>Dispatch Operator</Text>
            </View>
            <View style={styles.iconContainer}>
              <Ionicons
                name="mail"
                size={30}
                color={"#1B4965"}
                onPress={() => {
                  if (incidentState?.channelId) {
                    router.push({
                      pathname: "/landing/(room)/[id]",
                      params: {
                        id: incidentState.channelId as string,
                      },
                    });
                  }
                }}
              />
              <Ionicons
                name="videocam-sharp"
                size={30}
                color={"#1B4965"}
                onPress={() => {
                  if (incidentState?.channelId) {
                    router.push({
                      pathname: "/landing/(room)/video-call",
                      params: {
                        id: incidentState.channelId as string,
                      },
                    });
                  }
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerSection: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dispatcherName: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#1B4965",
  },
  iconContainer: {
    flexDirection: "row",
    gap: 12,
  },
});

export default IncidentDispatcherSection;
