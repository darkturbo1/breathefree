import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.oxyfree.quit',
  appName: 'Oxyfree',
  webDir: 'dist',
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    scheme: 'Oxyfree'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#4A90A4',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#4A90A4'
    }
  }
};

export default config;
