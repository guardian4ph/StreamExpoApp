import {View, Text, StyleSheet, ScrollView, Switch} from "react-native";
import React from "react";
import {TouchableOpacity} from "react-native-gesture-handler";
import {useIncidentStore} from "@/context/useIncidentStore";
import {useAuthStore} from "@/context/useAuthStore";
import {useUpdateUserData} from "@/api/user/useUpdateUserData";
import {useQueryClient} from "@tanstack/react-query";
import {useSettingsStore} from "@/context/useSettingsStore";
import {useRouter} from "expo-router";

export default function Settings() {
  const {user_id, logout} = useAuthStore();
  const {clearActiveIncident} = useIncidentStore();
  const queryClient = useQueryClient();
  const updateUserData = useUpdateUserData();
  const router = useRouter();

  const {
    enableAlerts,
    enableAnnouncements,
    notificationTone,
    doNotDisturb,
    criticalAlerts,
    shareLocation,
    autoUpdateLocation,
    notifications,
    setEnableAlerts,
    setEnableAnnouncements,
    setNotificationTone,
    setDoNotDisturb,
    setCriticalAlerts,
    setShareLocation,
    setAutoUpdateLocation,
    setNotification,
  } = useSettingsStore();

  const [expandedSections, setExpandedSections] = React.useState({
    account: false,
    notification: false,
    location: false,
    privacy: false,
    language: false,
    help: false,
    appInfo: false,
  });

  const handleClear = () => {
    clearActiveIncident!();
  };

  const handleEnableAlertsChange = async (value: boolean) => {
    setEnableAlerts(value);
    try {
      await updateUserData.mutateAsync({
        userId: user_id!,
        data: {
          settings: {
            isEnabled: true,
            isNotificationsEnabled: value,
            isAnnouncementEnabled: enableAnnouncements,
            isLocationSharingEnabled: shareLocation,
          },
        },
      });
      queryClient.invalidateQueries({queryKey: ["user", user_id]});
    } catch (error) {
      console.error("Failed to update notifications setting:", error);
    }
  };

  const handleEnableAnnouncementsChange = async (value: boolean) => {
    setEnableAnnouncements(value);
    try {
      await updateUserData.mutateAsync({
        userId: user_id!,
        data: {
          settings: {
            isEnabled: true,
            isNotificationsEnabled: enableAlerts,
            isAnnouncementEnabled: value,
            isLocationSharingEnabled: shareLocation,
          },
        },
      });
      queryClient.invalidateQueries({queryKey: ["user", user_id]});
    } catch (error) {
      console.error("Failed to update announcements setting:", error);
    }
  };

  const handleShareLocationChange = async (value: boolean) => {
    setShareLocation(value);
    try {
      await updateUserData.mutateAsync({
        userId: user_id!,
        data: {
          settings: {
            isEnabled: true,
            isNotificationsEnabled: enableAlerts,
            isAnnouncementEnabled: enableAnnouncements,
            isLocationSharingEnabled: value,
          },
        },
      });
      queryClient.invalidateQueries({queryKey: ["user", user_id]});
    } catch (error) {
      console.error("Failed to update location sharing setting:", error);
    }
  };

  const toggleNotification = (type: string) => {
    setNotification(type, !notifications[type as keyof typeof notifications]);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderSectionHeader = (
    title: string,
    section: keyof typeof expandedSections
  ) => (
    <TouchableOpacity
      style={styles.sectionHeader}
      onPress={() => toggleSection(section)}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.expandIcon}>
        {expandedSections[section] ? "▼" : "►"}
      </Text>
    </TouchableOpacity>
  );

  const renderNotificationItem = (label: any, type: any) => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationLabel}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => toggleNotification(type)}>
          <View
            style={[
              styles.checkbox,
              notifications[type as keyof typeof notifications] &&
                styles.checkboxChecked,
            ]}>
            {notifications[type as keyof typeof notifications] && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </View>
        </TouchableOpacity>
        <Text style={styles.itemText}>{label}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        {/* acc section */}
        {renderSectionHeader("Account", "account")}
        {expandedSections.account && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/landing/change-password")}>
              <Text style={styles.menuItemText}>Change Password</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/landing/profile")}>
              <Text style={styles.menuItemText}>Profile Image</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/landing/profile")}>
              <Text style={styles.menuItemText}>Personal Info</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/landing/profile")}>
              <Text style={styles.menuItemText}>
                Volunteer-Specific Information
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/landing/profile")}>
              <Text style={styles.menuItemText}>Upload Valid ID's</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/landing/profile")}>
              <Text style={styles.menuItemText}>Medical Concerns</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemText}>Deactivate</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* notifs sections */}
        {renderSectionHeader("Notification", "notification")}
        {expandedSections.notification && (
          <View style={styles.section}>
            <View style={styles.toggleSection}>
              <Text style={styles.toggleTitle}>Enable Alerts</Text>
              <Switch
                value={enableAlerts}
                onValueChange={handleEnableAlertsChange}
                trackColor={{false: "#d1d1d1", true: "#81b0ff"}}
                thumbColor={enableAlerts ? "#2c5282" : "#f4f3f4"}
              />
            </View>

            <View style={styles.notificationGrid}>
              <View style={styles.notificationColumn}>
                {renderNotificationItem("Weather", "weather")}
                {renderNotificationItem("Earthquake", "earthquake")}
                {renderNotificationItem("Flood", "flood")}
                {renderNotificationItem("Fire", "fire")}
                {renderNotificationItem("Crime", "crime")}
                {renderNotificationItem("Traffic", "traffic")}
              </View>
              <View style={styles.notificationColumn}>
                {renderNotificationItem("Government", "government")}
                {renderNotificationItem("Utilities", "utilities")}
                {renderNotificationItem("Overseas News", "overseasNews")}
              </View>
            </View>

            <View style={styles.toggleItem}>
              <Text style={styles.itemText}>Enable Announcements</Text>
              <Switch
                value={enableAnnouncements}
                onValueChange={handleEnableAnnouncementsChange}
                trackColor={{false: "#d1d1d1", true: "#81b0ff"}}
                thumbColor={enableAnnouncements ? "#2c5282" : "#f4f3f4"}
              />
            </View>

            <View style={styles.toggleItem}>
              <Text style={styles.itemText}>Notification Tone/Vibrate</Text>
              <Switch
                value={notificationTone}
                onValueChange={setNotificationTone}
                trackColor={{false: "#d1d1d1", true: "#81b0ff"}}
                thumbColor={notificationTone ? "#2c5282" : "#f4f3f4"}
              />
            </View>

            <View style={styles.toggleItem}>
              <Text style={styles.itemText}>Do not disturb/Silent Mode</Text>
              <Switch
                value={doNotDisturb}
                onValueChange={setDoNotDisturb}
                trackColor={{false: "#d1d1d1", true: "#81b0ff"}}
                thumbColor={doNotDisturb ? "#2c5282" : "#f4f3f4"}
              />
            </View>

            <View style={styles.toggleItem}>
              <Text style={styles.itemText}>
                Critical Alerts (override silent mode)
              </Text>
              <Switch
                value={criticalAlerts}
                onValueChange={setCriticalAlerts}
                trackColor={{false: "#d1d1d1", true: "#81b0ff"}}
                thumbColor={criticalAlerts ? "#2c5282" : "#f4f3f4"}
              />
            </View>
          </View>
        )}

        {/* loc section */}
        {renderSectionHeader("Location", "location")}
        {expandedSections.location && (
          <View style={styles.section}>
            <View style={styles.toggleItem}>
              <Text style={styles.itemText}>Share live location</Text>
              <Switch
                value={shareLocation}
                onValueChange={handleShareLocationChange}
                trackColor={{false: "#d1d1d1", true: "#81b0ff"}}
                thumbColor={shareLocation ? "#2c5282" : "#f4f3f4"}
              />
            </View>

            <View style={styles.toggleItem}>
              <Text style={styles.itemText}>Auto-update Location</Text>
              <Switch
                value={autoUpdateLocation}
                onValueChange={setAutoUpdateLocation}
                trackColor={{false: "#d1d1d1", true: "#81b0ff"}}
                thumbColor={autoUpdateLocation ? "#2c5282" : "#f4f3f4"}
              />
            </View>

            <Text style={styles.infoText}>
              Live and auto-update location is required to report incidents.
              Disabling it will prevent you from submitting reports, as location
              data is critical for emergency response.
            </Text>
          </View>
        )}

        {/* priv and secu section */}
        {renderSectionHeader("Privacy and Security", "privacy")}
        {expandedSections.privacy && (
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>
              Privacy and Security Settings
            </Text>
          </TouchableOpacity>
        )}

        {/* lang and reg section */}
        {renderSectionHeader("Language and Region", "language")}
        {expandedSections.language && (
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>
              Language and Region Settings
            </Text>
          </TouchableOpacity>
        )}

        {/* help and supp section */}
        {renderSectionHeader("Help and Support", "help")}
        {expandedSections.help && (
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Help and Support Center</Text>
          </TouchableOpacity>
        )}

        {/* app info section */}
        {renderSectionHeader("App Information", "appInfo")}
        {expandedSections.appInfo && (
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>About GuardianPH</Text>
          </TouchableOpacity>
        )}

        <View style={styles.devSection}>
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearButtonTextSmall}>
              *For testing purposes only*
            </Text>
            <Text style={styles.clearButtonText}>CLEAR INCIDENT</Text>
          </TouchableOpacity>
        </View>

        {/* logout button */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 30,
  },
  sectionHeader: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  expandIcon: {
    fontSize: 14,
    color: "#555",
  },
  section: {
    paddingVertical: 3,
  },
  menuItem: {
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  menuItemText: {
    fontSize: 14,
    color: "#333",
  },
  toggleSection: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  notificationGrid: {
    flexDirection: "row",
    paddingHorizontal: 15,
  },
  notificationColumn: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
  notificationLabel: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkboxContainer: {
    marginRight: 8,
  },

  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#2c5282",
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxChecked: {
    backgroundColor: "#2c5282",
  },

  checkmark: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  notificationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  toggleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  itemText: {
    fontSize: 14,
    color: "#333",
  },
  infoText: {
    fontSize: 12,
    color: "#666",
    paddingHorizontal: 15,
    paddingVertical: 10,
    lineHeight: 18,
  },
  devSection: {
    padding: 15,
    alignItems: "center",
  },
  clearButton: {
    backgroundColor: "#f4f0ec",
    padding: 7,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: "center",
  },
  clearButtonText: {
    color: "#000",
    textAlign: "center",
    fontWeight: "bold",
  },
  clearButtonTextSmall: {
    color: "#000",
    fontStyle: "italic",
    fontSize: 12,
  },
  logoutButton: {
    backgroundColor: "#f44336",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    marginHorizontal: 15,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
