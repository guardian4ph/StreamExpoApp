import {View, StyleSheet} from "react-native";
import React from "react";
import AlertPost from "@/components/landing-components/AlertPost";

const Landing = () => {
  return (
    <View style={styles.container}>
      <AlertPost />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
  },
});

export default Landing;
