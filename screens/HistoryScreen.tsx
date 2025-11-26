import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { storageService } from '../services/storageService';
import { Conversion } from '../types';

interface HistoryScreenProps {
  onNavigateBack: () => void;
}

export default function HistoryScreen({ onNavigateBack }: HistoryScreenProps) {
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversions();
  }, []);

  const loadConversions = async () => {
    try {
      const data = await storageService.getConversions();
      setConversions(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el historial');
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Confirmar',
      '¿Estás seguro de que quieres borrar todo el historial?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar',
          style: 'destructive',
          onPress: async () => {
            try {
              await storageService.clearConversions();
              setConversions([]);
              Alert.alert('Éxito', 'Historial borrado');
            } catch (error) {
              Alert.alert('Error', 'No se pudo borrar el historial');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderItem = ({ item }: { item: Conversion }) => (
    <View style={styles.conversionCard}>
      <View style={styles.conversionHeader}>
        <Text style={styles.conversionAmount}>
          {item.amount.toFixed(2)} {item.from}
        </Text>
        <Text style={styles.arrow}>→</Text>
        <Text style={styles.conversionResult}>
          {item.result.toFixed(2)} {item.to}
        </Text>
      </View>
      <View style={styles.conversionDetails}>
        <Text style={styles.rate}>Tasa: 1 {item.from} = {item.rate.toFixed(4)} {item.to}</Text>
        <Text style={styles.date}>{formatDate(item.date)}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onNavigateBack}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>📊 Historial</Text>
        {conversions.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClearHistory}>
            <Text style={styles.clearButtonText}>🗑️ Limpiar</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Cargando...</Text>
        </View>
      ) : conversions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyText}>No hay conversiones todavía</Text>
          <Text style={styles.emptySubtext}>
            Realiza tu primera conversión para verla aquí
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  clearButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  listContainer: {
    padding: 20,
  },
  conversionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  conversionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  conversionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  arrow: {
    fontSize: 20,
    color: '#4CAF50',
    marginHorizontal: 10,
  },
  conversionResult: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    flex: 1,
    textAlign: 'right',
  },
  conversionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rate: {
    fontSize: 12,
    color: '#666',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
