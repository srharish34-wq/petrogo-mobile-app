import { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, BackHandler, ActivityIndicator, Platform, StatusBar as RNStatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';

const APPS = [
  { id: 'user', name: 'User App', url: 'https://petrogo-frontend.vercel.app/', color: '#3b82f6', icon: '👤' },
  { id: 'partner', name: 'Partner App', url: 'https://petrogo-partner.vercel.app/', color: '#10b981', icon: '🤝' },
  { id: 'admin', name: 'Admin Panel', url: 'https://petrogo-admin.vercel.app/', color: '#8b5cf6', icon: '⚙️' },
];

export default function App() {
  const [currentUrl, setCurrentUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    const backAction = () => {
      if (currentUrl) {
        if (canGoBack && webViewRef.current) {
          webViewRef.current.goBack();
          return true; // Prevent default (exiting app)
        } else {
          // Go back to home menu
          setCurrentUrl(null);
          return true; // Prevent default
        }
      }
      return false; // Exit app if at home menu
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [currentUrl, canGoBack]);

  const renderHome = () => (
    <SafeAreaView style={styles.homeContainer}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>PetroGo App</Text>
        <Text style={styles.subtitle}>Select an environment to continue</Text>
      </View>

      <View style={styles.cardContainer}>
        {APPS.map((app) => (
          <TouchableOpacity
            key={app.id}
            style={[styles.card, { borderLeftColor: app.color }]}
            onPress={() => {
              setLoading(true);
              setCurrentUrl(app.url);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.cardIcon}>{app.icon}</Text>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{app.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );

  return (
    <View style={styles.container}>
      {currentUrl ? (
        <SafeAreaView style={styles.webviewContainer}>
          <StatusBar style="dark" />
          <View style={styles.webviewHeader}>
            <TouchableOpacity onPress={() => setCurrentUrl(null)} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>← Home Menu</Text>
            </TouchableOpacity>
            <Text style={styles.webviewDomain} numberOfLines={1}>
               {currentUrl.replace('https://', '').replace(/\/$/, '')}
            </Text>
            {loading && <ActivityIndicator size="small" color="#000" style={styles.loader} />}
          </View>
          
          <WebView
            ref={webViewRef}
            source={{ uri: currentUrl }}
            style={styles.webview}
            onNavigationStateChange={(navState) => {
              setCanGoBack(navState.canGoBack);
              if (!navState.loading) setLoading(false);
            }}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            scalesPageToFit={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            renderLoading={() => (
               <View style={styles.absoluteLoader}>
                   <ActivityIndicator size="large" color="#3b82f6" />
               </View>
            )}
          />
        </SafeAreaView>
      ) : (
        renderHome()
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  homeContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight + 40 : 60,
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
  },
  cardContainer: {
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    borderLeftWidth: 6,
  },
  cardIcon: {
    fontSize: 36,
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  cardUrl: {
    fontSize: 13,
    color: '#94a3b8',
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  webviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    position: 'relative',
    backgroundColor: '#fff',
  },
  closeBtn: {
    position: 'absolute',
    left: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    zIndex: 10,
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  webviewDomain: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94a3b8',
    maxWidth: '50%',
  },
  loader: {
    position: 'absolute',
    right: 16,
  },
  absoluteLoader: {
    position: 'absolute',
    top: 54, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    zIndex: 5,
  },
  webview: {
    flex: 1,
  },
});
