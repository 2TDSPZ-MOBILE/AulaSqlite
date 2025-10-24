import { useRouter } from "expo-router"
import { MotiView } from "moti"
import React, { useState } from 'react'
import { Alert, Button, TextInput, View } from "react-native"
import { addNote } from '../src/db/notes'

export default function AddNoteScreen() {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const router = useRouter() //Hook de navegação

    //Função chamada ao pressionar "Salvar"
    function handleSave() {
        if (!title.trim()) {
            Alert.alert("Atenção", "Digite um título para a note")
            return
        }
        addNote(title, content)//adiciona no banco
        router.back()//Volta para a tela de lista
    }
    return (
        <View style={{ flex: 1, padding: 20 }}>
            <MotiView
                from={{ opacity: 0, translateY: 30 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 500 }}
            >
                <MotiView
                    from={{ opacity: 0, translateX: -30 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    transition={{ delay: 400 }}
                >
                    <TextInput
                        placeholder='Título'
                        value={title}
                        onChangeText={(value) => setTitle(value)}
                        style={{
                            borderWidth: 1, padding: 10, marginBottom: 10,
                            borderRadius: 6
                        }}
                    />
                </MotiView>


                <MotiView
                    from={{ opacity: 0, translateX: 30 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    transition={{ delay: 400 }}
                >
                    <TextInput
                        placeholder='Conteúdo'
                        value={content}
                        onChangeText={(value) => setContent(value)}
                        multiline
                        style={{
                            borderWidth: 1, padding: 10, height: 120,
                            borderRadius: 6
                        }}
                    />
                </MotiView>

                <MotiView
                  from={{scale:0.8,opacity:0.8}}  
                  animate={{scale:1,opacity:1}}
                  transition={{
                    loop:true,
                    type:"timing",
                    duration:1000
                  }} 
                >
                    <Button title='Salvar' onPress={handleSave} />
                </MotiView>

            </MotiView>
        </View>
    )
}
