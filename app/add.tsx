
import React,{useState} from 'react'
import {View,TextInput,Button, Alert} from "react-native"
import {useRouter} from "expo-router"
import { addNote } from '../src/db/notes'

export default function AddNoteScreen(){
    const[title,setTitle]=useState("")
    const[content,setContent]=useState("")
    const router = useRouter() //Hook de navegação

    //Função chamada ao pressionar "Salvar"
    function handleSave(){
        if(!title.trim()){
            Alert.alert("Atenção","Digite um título para a note")
            return
        }
        addNote(title,content)//adiciona no banco
        router.back()//Volta para a tela de lista
    }
    return(
        <View style={{flex:1,padding:20}}> 
            <TextInput 
                placeholder='Título' 
                value={title}
                onChangeText={(value)=>setTitle(value)}
                style={{
                    borderWidth:1,padding:10,marginBottom:10,
                    borderRadius:6
                }}            
            />

            <TextInput 
                placeholder='Conteúdo'
                value={content}
                onChangeText={(value)=>setContent(value)}
                multiline
                style={{
                    borderWidth:1,padding:10,height:120,
                    borderRadius:6
                }} 
            />
            <Button title='Salvar' onPress={handleSave}/>
        </View>
    )
}
