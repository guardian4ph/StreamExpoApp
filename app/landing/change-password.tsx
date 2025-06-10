import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import React, {useState} from "react";
import Spinner from "react-native-loading-spinner-overlay";

export default function ChangePasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <StatusBar
        hidden={false}
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Spinner visible={loading} />

      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.innerContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.appTitle}>GUARDIANPH V3</Text>
            <Text style={styles.pageTitle}>Change Password</Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              value={newPassword}
              placeholder="Enter new password"
              onChangeText={setNewPassword}
              style={styles.textField}
              placeholderTextColor="gray"
              secureTextEntry={true}
              returnKeyType="next"
            />
            <TextInput
              value={confirmPassword}
              placeholder="Re-enter new password"
              onChangeText={setConfirmPassword}
              style={styles.textField}
              placeholderTextColor="gray"
              secureTextEntry={true}
              returnKeyType="done"
            />

            <TouchableOpacity style={styles.buttonChange}>
              <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  innerContainer: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    marginTop: 60,
    marginBottom: 40,
    alignItems: "center",
  },
  appTitle: {
    fontSize: 24,
    color: "#1B4965",
    fontWeight: "bold",
    marginBottom: 3,
  },
  pageTitle: {
    fontSize: 18,
    color: "#1B4965",
    fontWeight: "500",
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  textField: {
    marginVertical: 10,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    padding: 15,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  buttonChange: {
    marginTop: 30,
    backgroundColor: "#1B4965",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
