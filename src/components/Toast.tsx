import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ToastMessage {
  id: number;
  text: string;
}

interface ToastContextValue {
  showToast: (text: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const AUTO_DISMISS_MS = 6000;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const timeoutIds = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  useEffect(() => {
    const pending = timeoutIds.current;
    return () => {
      pending.forEach(clearTimeout);
      pending.clear();
    };
  }, []);

  const showToast = useCallback((text: string) => {
    const id = Date.now() + Math.random();
    setToasts(current => [...current, { id, text }]);
    const timeoutId = setTimeout(() => {
      timeoutIds.current.delete(timeoutId);
      setToasts(current => current.filter(toast => toast.id !== id));
    }, AUTO_DISMISS_MS);
    timeoutIds.current.add(timeoutId);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <View style={styles.container} pointerEvents="none">
        {toasts.map(toast => (
          <View key={toast.id} style={styles.toast} accessibilityRole="alert">
            <Text style={styles.text}>{toast.text}</Text>
          </View>
        ))}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 32,
    left: 16,
    right: 16,
    gap: 8,
  },
  toast: {
    backgroundColor: '#262626',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  text: {
    color: '#fff',
    fontSize: 14,
  },
});
