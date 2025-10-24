import { useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  runOnJS, useAnimatedStyle, useSharedValue,
  withDelay, withTiming
} from "react-native-reanimated";
import { deleteNote, getNotes } from "../src/db/notes";

export default function HomeScreen() {
  const [notes, setNotes] = useState<any[]>([])//estado para armazenar as notas
  const router = useRouter()//Hook de navegação do Expo Router

  //useFocusEffect executa sempre que a tela volta a ser foco
  useFocusEffect(
    React.useCallback(() => {
      setNotes(getNotes()) //Carregar as notas do banco de dados local
    }, [])
  )

  //Função para deletar a nota
  function handleDelete(id: number) {
    deleteNote(id) //Remove do banco a nota pelo id passando no parametro
    setNotes(getNotes()) //Atualiza a lista
  }

  //Componente que renderiza cada nota individualmente
  const RenderNote = ({ item, index }: any) => {
    //Valor compartilhado para swipe horizontal
    const translateX = useSharedValue(0)

    //Valores de entrada animado(fade+slide vertical)
    const translateY = useSharedValue(20)//Slide de baixo para cima
    const opacity = useSharedValue(0) //Fade inicial

    //Animação de entrada das notas
    translateY.value = withDelay(index * 100, withTiming(0, { duration: 300 }));
    opacity.value = withDelay(index * 100, withTiming(1, { duration: 300 }));

    //Implementação do Swipe
    const pan = Gesture.Pan()
      .onUpdate((e) => {
        //Permite arrastar somente para esquerda
        translateX.value = Math.min(0, e.translationX)
      })
      .onEnd(() => {
        //Se o swipe ultrapassar -100px, dispara a exclusão.
        if (translateX.value < -100) {
          //Anima a nota para fora da tela
          translateX.value = withTiming(-500, { duration: 200 })
          //Desaperece com fade
          opacity.value = withTiming(0, { duration: 200 }, () => runOnJS(handleDelete)(item.id))
        } else {
          //Caso contrário, volta para a posição, que no caso é 0
          translateX.value = withTiming(0)
        }
      })

    //Estilo animado de nota combinado swipe horizontal
    const animatedStyle = useAnimatedStyle(() => (
      {
        transform: [
          { translateX: translateX.value },
          { translateY: translateY.value }
        ],
        opacity: opacity.value,
      }
    ))

    //Estilo animamado do fundo que parece ao arrastar
    const backgroundStyle = useAnimatedStyle(() => ({
      opacity: translateX.value !== 0 ? 1 : 0,
    }))

    return (
      <GestureDetector gesture={pan}>
        {/* Container principal que mantém o fundo vermelho atrás da nota */}
        <View style={{ position: 'relative', marginVertical: 5 }}>
          {/* {Fundo vermelho será apresentado quando o usuário arrastar a nota} */}
          <Animated.View style={[styles.deleteBackground, backgroundStyle]}>
            <Text style={styles.deleteText}>Excluindo....</Text>
          </Animated.View>

          {/* Nota animada (entrada + swipe) */}
          <Animated.View style={[styles.noteItem, animatedStyle]}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.content}</Text>
            <View style={{ flexDirection: 'row', marginTop: 5 }}>
              <Button title="Editar" onPress={() => router.push(`/edit/${item.id}`)} />
              <View style={{ width: 10 }} />
              <Button title="Deletar"
                onPress={() => handleDelete(item.id)}
              />
            </View>
          </Animated.View>
        </View>
      </GestureDetector>
    )
  }

  return (
    //É necessário envolver a aplicação para ter acesso ao GestureHandler, para o funcionamento correto.
    <GestureHandlerRootView style={{flex:1}}>
      <View
        style={{ flex: 1, padding: 20 }}
      >
        <Button title="Adicionar Nota"
          onPress={() => router.push('/add')}
        />

        <FlatList
          data={notes}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item, index }) => (
            <RenderNote item={item} index={index}/>
          )}
          contentContainerStyle={{paddingVertical:10}}
        />
      </View>
    </GestureHandlerRootView>


  );
}

const styles = StyleSheet.create({
  //
  noteItem: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8
  },
  title: {
    fontWeight: "bold",
    fontSize: 16
  },
  deleteBackground: {
    ...StyleSheet.absoluteFillObject,//Cobre toda a área da nota
    backgroundColor: "#ff4d4d",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 20,
    borderRadius: 8
  },
  deleteText: {
    color: "white",
    fontWeight: "bold"
  }
})