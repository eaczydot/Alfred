import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { AlertTriangle } from "lucide-react-native";
import { Theme } from "@/constants/theme";
import { Button } from "@/components/ui/Button";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "ERROR 404" }} />
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <AlertTriangle size={48} color={Theme.tokens.color.status.warn} />
        </View>
        <Text style={styles.errorCode}>ERROR 404</Text>
        <Text style={styles.title}>SIGNAL LOST</Text>
        <Text style={styles.description}>
          The requested data stream could not be established. Target coordinates not found.
        </Text>
        
        <Link href="/" asChild>
          <Button title="RETURN TO BASE" variant="primary" style={styles.button} />
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    backgroundColor: Theme.tokens.color.bg[0],
    gap: 16,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(234, 179, 8, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(234, 179, 8, 0.2)',
    marginBottom: 8,
  },
  errorCode: {
    fontSize: 12,
    color: Theme.tokens.color.status.warn,
    letterSpacing: 2,
    fontWeight: '700',
    fontFamily: Theme.tokens.typography.fontFamily.mono,
  },
  title: {
    fontSize: 24,
    fontWeight: "400",
    color: Theme.tokens.color.text.primary,
    letterSpacing: 4,
  },
  description: {
    fontSize: 14,
    color: Theme.tokens.color.text.tertiary,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 280,
    fontFamily: Theme.tokens.typography.fontFamily.mono,
  },
  button: {
    marginTop: 32,
    paddingHorizontal: 32,
  },
});
