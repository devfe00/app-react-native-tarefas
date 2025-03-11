import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const ListaTarefasScreen = ({ route, navigation }) => {
  const [tarefas, setTarefas] = useState([]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Lista Tarefa', // Espaço
    });
  }, [navigation]);
  

  const carregarTarefas = async () => {
    try {
      const tarefasSalvas = await AsyncStorage.getItem('tarefas');
      if (tarefasSalvas) {
        setTarefas(JSON.parse(tarefasSalvas));
      }
    } catch (error) {
      console.error("Erro ao carregar tarefas do AsyncStorage", error);
    }
  };

  useEffect(() => {
    carregarTarefas();
    if (route.params?.tarefa) {
      
      if (validarData(route.params.tarefa.dataConclusao)) {
        setTarefas((prevTarefas) => {
          const novasTarefas = [...prevTarefas, route.params.tarefa];
          AsyncStorage.setItem('tarefas', JSON.stringify(novasTarefas)); 
          return novasTarefas;
        });
      } else {
        Alert.alert("Erro", "Data de conclusão não pode ser no passado");
     
        }
    }
  }, [route.params?.tarefa]);


  const validarData = (dataString) => {
    try {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0); 
      
      const [dia, mes, ano] = dataString.split('/').map(num => parseInt(num, 10));
      const dataTarefa = new Date(ano, mes - 1, dia);
      
      return dataTarefa >= hoje;
    } catch (error) {
      console.error("Erro ao validar data:", error);
      return false;
    }
  };


  const converterStringParaData = (dataString) => {
    try {
      const [dia, mes, ano] = dataString.split('/').map(num => parseInt(num, 10));
   
      return new Date(ano, mes - 1, dia);
    } catch (error) {
      console.error("Erro ao converter data:", error);
      return new Date();
    }
  };


  const marcarComoConcluida = (index) => {
    setTarefas((prevTarefas) => {
      const novasTarefas = prevTarefas.map((tarefa, i) => {
        if (i === index) {
          return { ...tarefa, concluida: !tarefa.concluida };
        }
        return tarefa;
      });
      AsyncStorage.setItem('tarefas', JSON.stringify(novasTarefas)); 
      return novasTarefas;
    });
  };

  // Remove uma tarefa da lista
  const removerTarefa = async (index) => {
    try {
      const tarefasAtualizadas = tarefas.filter((_, i) => i !== index);
      setTarefas(tarefasAtualizadas);
      await AsyncStorage.setItem('tarefas', JSON.stringify(tarefasAtualizadas));
    } catch (error) {
      console.error("Erro ao remover tarefa:", error);
    }
  };


  const tarefasOrdenadas = [...tarefas].sort((a, b) => {
    const dataA = converterStringParaData(a.dataConclusao);
    const dataB = converterStringParaData(b.dataConclusao);
    
    return dataA - dataB;
  });


  const formatarData = (dataString) => {
    try {
      const [dia, mes, ano] = dataString.split('/');
      return `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/${ano}`;
    } catch (error) {
      return dataString;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lista de Tarefas</Text>
      
      {tarefas.length === 0 ? (
        <Text style={styles.emptyMessage}>Nenhuma tarefa cadastrada</Text>
      ) : (
        <FlatList
          data={tarefasOrdenadas}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={[
              styles.tarefa,
              item.concluida ? styles.tarefaConcluida : null
            ]}>
              <Text style={styles.titulo}>{item.titulo}</Text>
              <Text style={styles.dataText}>
                Data de conclusão: {formatarData(item.dataConclusao)}
              </Text>
              <Text style={styles.statusText}>
                Status: {item.concluida ? '✅ Concluída' : '⏳ Pendente'}
              </Text>
              
              <View style={styles.botoesContainer}>
                <TouchableOpacity
                  style={[styles.botao, item.concluida ? styles.botaoPendente : styles.botaoConcluir]}
                  onPress={() => marcarComoConcluida(index)}
                >
                  <Text style={styles.botaoTexto}>
                    {item.concluida ? '❌ Pendente' : '✅ Concluir'}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.botao, styles.botaoRemover]}
                  onPress={() => removerTarefa(index)}
                >
                  <Text style={styles.botaoTexto}>🗑️ Remover</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
      
      <TouchableOpacity
        style={styles.botaoAdicionar}
        onPress={() => navigation.navigate('AdicionarTarefa')}
      >
        <Text style={styles.botaoAdicionarTexto}>+ Adicionar Nova Tarefa</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#007bff',
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 30,
    color: '#6c757d',
  },
  tarefa: {
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tarefaConcluida: {
    backgroundColor: '#e8f4ff',
    borderColor: '#b8daff',
  },
  titulo: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    color: '#212529',
  },
  dataText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#495057',
  },
  statusText: {
    fontSize: 14,
    marginBottom: 10,
    color: '#495057',
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  botao: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  botaoConcluir: {
    backgroundColor: '#28a745',
  },
  botaoPendente: {
    backgroundColor: '#ffc107',
  },
  botaoRemover: {
    backgroundColor: '#dc3545',
  },
  botaoTexto: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  botaoAdicionar: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  botaoAdicionarTexto: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    
    },
});

export default ListaTarefasScreen;

