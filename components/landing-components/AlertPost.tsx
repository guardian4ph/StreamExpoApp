import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import React, {useEffect, useState} from "react";
import {sampleAlerts} from "@/assets/data/sampleAlerts";
import Alert from "@/types/Alerts";

export default function AlertPost() {
  const [alerts, setAlerts] = useState<Alert[] | null>([]);

  useEffect(() => {
    setAlerts(sampleAlerts);
  }, []);

  const renderItem = ({item: alert}: {item: Alert}) => (
    <View key={alert.id} style={styles.alertContainer}>
      <View style={styles.alertHeader}>
        <Image
          source={require("@/assets/images/emergencyMedical.png")}
          style={{width: 45, height: 45}}
          defaultSource={require("@/assets/images/emergencyMedical.png")}
        />
        <View>
          <Text style={styles.opCenter}>{alert.opCenter}</Text>
          <Text>{alert.dateTime}</Text>
        </View>
      </View>
      <View style={{marginTop: 10}}>
        <Text style={styles.alertTitle}>{alert.title}</Text>
        <Text>{alert.address}</Text>
        <Text style={{marginTop: 10}}>{alert.caption}</Text>
        <Image
          source={require("@/assets/images/alertImg.jpg")}
          style={styles.alertImg}
          defaultSource={require("@/assets/images/alertImg.jpg")}
        />
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

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={alerts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
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
  },
  alertHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginTop: 5,
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
  alertImg: {
    width: "100%",
    height: 200,
    marginVertical: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 5,
  },
  alertReact: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
});
