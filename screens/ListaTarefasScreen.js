import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const ListaTarefasScreen = ({ route, navigation }) => {
  const [tarefas, setTarefas] = useState([]);

  // Atualiza a lista sempre que uma nova tarefa for adicionada
  useEffect(() => {
    if (route.params?.tarefa) {
      // Verifica se a data da tarefa é válida antes de adicionar
      if (validarData(route.params.tarefa.dataConclusao)) {
        setTarefas((prevTarefas) => [...prevTarefas, route.params.tarefa]);
      } else {
        Alert.alert("Erro", "Data de conclusão não pode ser no passado");
        // Não adiciona a tarefa se a data for inválida
      }
    }
  }, [route.params?.tarefa]);

  // Função para validar se a data está no futuro
  const validarData = (dataString) => {
    try {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0); // Zera as horas para comparar apenas as datas
      
      const [dia, mes, ano] = dataString.split('/').map(num => parseInt(num, 10));
      // Mês em JavaScript é baseado em zero (0-11)
      const dataTarefa = new Date(ano, mes - 1, dia);
      
      return dataTarefa >= hoje;
    } catch (error) {
      console.error("Erro ao validar data:", error);
      return false;
    }
  };

  // Função para converter string de data para objeto Date
  const converterStringParaData = (dataString) => {
    try {
      const [dia, mes, ano] = dataString.split('/').map(num => parseInt(num, 10));
      // Mês em JavaScript é baseado em zero (0-11)
      return new Date(ano, mes - 1, dia);
    } catch (error) {
      console.error("Erro ao converter data:", error);
      return new Date(); // Retorna data atual em caso de erro
    }
  };

  // Alterna o status da tarefa (Concluída <-> Pendente)
  const marcarComoConcluida = (index) => {
    setTarefas((prevTarefas) => {
      const novasTarefas = [...prevTarefas];
      novasTarefas[index].concluida = !novasTarefas[index].concluida;
      return novasTarefas;
    });
  };

  // Remove uma tarefa da lista
  const removerTarefa = (index) => {
    setTarefas((prevTarefas) => {
      const novasTarefas = [...prevTarefas];
      novasTarefas.splice(index, 1);
      return novasTarefas;
    });
  };

  // Ordena as tarefas pela data de conclusão
  const tarefasOrdenadas = [...tarefas].sort((a, b) => {
    const dataA = converterStringParaData(a.dataConclusao);
    const dataB = converterStringParaData(b.dataConclusao);
    
    return dataA - dataB;
  });

  // Formata a data para exibição no formato brasileiro
  const formatarData = (dataString) => {
    try {
      const [dia, mes, ano] = dataString.split('/');
      return `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/${ano}`;
    } catch (error) {
      return dataString; // Retorna a string original em caso de erro
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
    borderRadius: 10,
    marginTop: 10,
  },
  botaoAdicionarTexto: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ListaTarefasScreen;

