import { View, Text, StyleSheet } from 'react-native';

export default function ClubsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clubs</Text>
      <Text style={styles.text}>Explore various clubs and activities.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1f2937',
  },
  text: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});