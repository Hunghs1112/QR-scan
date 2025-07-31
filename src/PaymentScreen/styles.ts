// styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  background: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    height: 76,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  backButton: {
    padding: 10,
    marginLeft: -14,
    
  },
  backIconImage: {
    width: 46,
    height: 46,
  },
    backIconImage1: {
    width: 54,
    height: 54,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationIconImage: {
    width: 24,
    height: 24,
  },
  homeIcon: {
    marginLeft: -8,
  },
  homeIconImage: {
    width: 24,
    height: 24,
  },
  transferTitle: {
    fontSize: 30,
    fontWeight: 'light',
    color: '#113038',
    paddingLeft: 14,
    marginTop: 4,
    fontFamily: 'Roboto',
  },
  lightBlueSection: {
    backgroundColor: '#edf7f8',
    paddingTop: 12,
    paddingBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 16,
    marginTop: 8,
  },
  transferOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 8,
    marginRight: 2,
    gap: 10,
  },
  optionBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D6E8FB',
    borderRadius: 4,
    paddingBottom: 14,
    paddingTop: 6,
    height: 108,
    marginTop: 12,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doubleWidthOption: {
    flex: 2.1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D6E8FB',
    borderRadius: 4,
    paddingBottom: 14,
    paddingTop: 6,
    height: 108,
    marginTop: 12,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Roboto',
    color: '#113038',
    textAlign: 'left',
    paddingHorizontal: 10,
    flexWrap: 'wrap',
    width: '90%',
  },
  optionText1: {
    fontSize: 17,
    fontFamily: 'Roboto',
    color: '#113038',
    textAlign: 'left',
    paddingHorizontal: 10,
    flexWrap: 'wrap',
    width: '100%',
  },
  optionImage: {
    width: 36,
    height: 36,
    borderColor: '#D6E8FB',
    borderRadius: 12,
    marginLeft: 4,
    alignSelf: 'flex-start',
    paddingLeft: 12,
    marginBottom: 4,
  },
  bottomOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 0,
    gap: 12,
  },
  qrButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  recentSection: {
    marginTop: 14,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 16,
    fontFamily: 'Roboto',
    color: '#113038',
  },
  avatarList: {
    marginLeft: 10,
    marginTop: 12,
    paddingHorizontal: 14,
    gap: 16, // Increased gap for better spacing
  },
  avatarContainer: {
    alignItems: 'center',
    marginRight: 16,
    width: 90, // Increased width to accommodate wrapped text
    height: 80, // Fixed height to accommodate two lines of text
    justifyContent: 'flex-start', // Align content from the top
  },
  avatar: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: '#D6E8FB',
    backgroundColor: 'white',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  avatarName: {
    fontSize: 14,
    fontFamily: 'Roboto',
    color: '#1A1A1A',
    marginTop: 10, // Fixed margin to align text starting point
    textAlign: 'center',
    width: '120%', // Allow some padding within the container
    flexWrap: 'wrap', // Enable text wrapping
    textTransform: 'uppercase', // Optional: match the image style
  },
  whiteSection: {
    backgroundColor: 'rgba(249,248,254, 1)',
    paddingBottom: 12,
    minHeight: 300,
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 26,
    paddingHorizontal: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  tabActive: {
    backgroundColor: '#99d4f4',
    borderWidth: 1,
    borderColor: '#D6E8FB',
  },
  tabInactive: {
    backgroundColor: '#f9f8fe',
  },
  tabTextActive: {
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    color: '#192f39',
  },
  tabTextInactive: {
    fontSize: 14,
    fontFamily: 'Roboto',
    color: '#2f5884',
  },
searchBar: {
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(254, 254, 254, 1)',
    borderRadius: 6,
    marginTop: 17,
    paddingVertical: 12,
    marginHorizontal: 17,
    paddingHorizontal: 16,
    borderWidth: 0.4,
    borderColor: '#D6E8FB'
  },
  searchImage: {
    width: 20,
    height: 20,
    justifyContent: 'center', // Center the image inside the container
    alignItems: 'center', // Center the image inside the container
  },
  searchIcon: {
    width: '200%', // Ensure the image takes the full width of the parent
    height: '200%', // Ensure the image takes the full height of the parent
  },
  searchPlaceholder: {
   
    fontSize: 16,
    fontFamily: 'Roboto',
    color: '#888',
  },
});

export default styles;