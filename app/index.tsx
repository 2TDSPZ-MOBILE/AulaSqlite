import { useFocusEffect, useRouter } from "expo-router";
import { MotiText, MotiView } from "moti";
import React, { useState } from "react";
import { Button, FlatList, Text, View } from "react-native";
import { deleteNote, getNotes } from "../src/db/notes";

export default function HomeScreen() {
  const[notes,setNotes]=useState<any[]>([])//estado para armazenar as notas
  const router = useRouter()//Hook de navegação do Expo Router

  //useFocusEffect executa sempre que a tela volta a ser foco
  useFocusEffect(
    React.useCallback(()=>{
      setNotes(getNotes()) //Carregar as notas do banco de dados local
    },[])
  )

  //Função para deletar a nota
  function handleDelete(id:number){
    deleteNote(id) //Remove do banco a nota pelo id passando no parametro
    setNotes(getNotes()) //Atualiza a lista
  }
  return (
    <View
      style={{flex: 1,padding:20}}
    >
     <Button title="Adicionar Nota"
        onPress={()=>router.push('/add')}
     /> 

     <FlatList 
        data={notes}
        keyExtractor={item=>item.id.toString()}
        renderItem={({item,index})=>(
          <MotiView 
            from={{opacity:0,translateY:20}}
            animate={{opacity:1,translateY:0}}
            transition={{delay:index*100}}

            style={{
            borderBottomWidth:1,
            padding:10,
            marginBottom:5
          }}>
            <MotiText 
              from={{scale:0.95}}
              animate={{scale:1}}
              transition={{type:'timing',duration:1000}}
              style={{fontWeight:'bold',fontSize:16}}>
              {item.title} 
            </MotiText>
            <Text>
              {item.content}
            </Text>
            <View style={{flexDirection:'row',marginTop:5}}>
                <Button title="Editar" onPress={()=>router.push(`/edit/${item.id}`)}/>
                <View style={{width:10}}/>
                <Button title="Deletar" 
                   onPress={()=>handleDelete(item.id)}
                />           
            </View>
          </MotiView>
        )}
     />
    </View>
  );
}
