import React, {useCallback} from "react";
import {View, Text, Image, TouchableOpacity, StyleSheet} from "react-native";
import {useRouter, usePathname} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import {Incident} from "@/types/incidents";
import {useGetResponder} from "@/api/responder/useGetResponder";
import {useGetOpcen} from "@/api/opCen/useGetOpcen";
import formatResponderStatus from "@/utils/FormatResponderStatus";
import GetIcon from "@/utils/GetIcon";

interface IncidentResponderSectionProps {
  incidentState: Incident | null;
}

const IncidentResponderSection: React.FC<IncidentResponderSectionProps> = ({
  incidentState,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const isMapView = pathname === "/landing/map-view";
  const {data: responder, isLoading: isResponderLoading} = useGetResponder(
    incidentState?.responder as string
  );
  const {data: opCen, isLoading: isOpCenLoading} = useGetOpcen(
    responder?.operationCenter as string
  );

  // console.log(incidentState);
  // console.log(responder);

  return (
    <View style={styles.ambulanceContainer}>
      <View style={styles.incidentCard}>
        <View style={styles.headerSection}>
          <View style={styles.headerRow}>
            <Image
              source={GetIcon(incidentState?.incidentType as string)}
              resizeMode="contain"
              style={styles.logoImage}
            />
            <View style={styles.headerText}>
              <Text style={styles.ambulanceId}>
                {responder?.firstName} {responder?.lastName}
              </Text>
              <Text style={styles.address}>
                {opCen?.firstName} {opCen?.lastName}
              </Text>
            </View>
          </View>
        </View>

        {/* ETA section */}
        <View style={styles.etaContainer}>
          <View style={styles.etaStatus}>
            <Text style={styles.etaStatusText}>
              {formatResponderStatus(incidentState?.responderStatus as string)}
            </Text>
          </View>
          <View style={styles.etaDetails}>
            <View style={styles.etaItem}>
              <Text style={styles.etaLabel}>ETA</Text>
              <Text style={styles.etaValue}>4min</Text>
            </View>
            <View style={styles.etaItem}>
              <Text style={styles.etaLabel}>DIS</Text>
              <Text style={styles.etaValue}>600m</Text>
            </View>
          </View>
        </View>
        {!isMapView && (
          <TouchableOpacity
            style={styles.mapButtonContainer}
            onPress={() => router.push("/landing/(room)/map-view")}>
            <Ionicons name="map" size={24} color="#1B4965" />
            <Text style={styles.mapButtonText}>View Map</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ambulanceContainer: {
    marginBottom: 5,
  },
  incidentCard: {
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerSection: {
    padding: 15,
  },
  address: {
    fontSize: 14,
    color: "#666",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  medicalIcon: {
    width: 50,
    height: 50,
  },
  headerText: {
    flex: 1,
  },
  logoImage: {
    width: 50,
    height: 50,
  },

  subHeading: {
    padding: 10,
    backgroundColor: "#1B4965",
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconContainer: {
    flexDirection: "row",
    gap: 15,
  },
  ambulanceId: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ff6b6b",
    marginBottom: 5,
  },
  etaContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  etaStatus: {
    flex: 1,
    backgroundColor: "#1B4965",
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  etaStatusText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  etaDetails: {
    flex: 1,
    backgroundColor: "#1B4965",
    padding: 5,
    borderLeftWidth: 1,
    borderLeftColor: "white",
  },
  etaItem: {
    marginBottom: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  etaLabel: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  etaValue: {
    color: "#ff6b6b",
    fontWeight: "bold",
    fontSize: 14,
  },
  mapButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    gap: 10,
  },
  mapButtonText: {
    color: "#1B4965",
    fontSize: 16,
    fontWeight: "500",
  },
  callContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    margin: 0,
    padding: 0,
    zIndex: 9999,
  },
  cancelButtonWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#f3f5f5",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  cancelButtonContainer: {
    backgroundColor: "#ff6b6b",
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
});

export default IncidentResponderSection;
