import * as React from 'react';
import { useState } from 'react';
import api from '../../services/api';
import { Text, ActivityIndicator,KeyboardAvoidingView,Platform } from 'react-native';
import { TextInput, HelperText, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import Alert from '../Componentes/Alert';

export default function LoginScreen(props) {

  const navigation = useNavigation();

  const [email_p, setEmail] = useState('');
  const [senha_p, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [pwErr, setPwErr] = useState(false);

  const [alertContent, setAlertContent] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  

  function navigateToSignUp() {
    navigation.navigate('Cadastro');
  }

  async function handleValidation() {
    if (loading) {
      return;
    }
    let existe_erro = false;
    if (!isEmail(email_p)) {
      existe_erro = true;
      setEmailErr(true);
    }
    if (senha_p.length < 6) {
      existe_erro = true;
      setPwErr(true);
    }
    if (!existe_erro) {
      await handleLogin();
    }

  }

  async function handleLogin() {
    setLoading(true);
    try {
      const response = await api.post('users/login', { senha_p, email_p });
      const id = response.data;
      props.setIsSignIn({
        id: id,
        loggedIn: true
      });
    } catch (err) {
      setShowAlert(true);
      setAlertContent(err.response.data.error)
    }
    //setLoading(false);
  }

  function isEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  return (
    <>
      <KeyboardAvoidingView 
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Text style={styles.textTop}>Entre com a sua conta para salvar suas receitas favoritas!</Text>
         <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email_p}
          placeholderTextColor="black"
          onChangeText={text => { setEmail(text); setEmailErr(false) }}
          underlineColor="transparent"
          theme={{
            colors: {
              primary: 'transparent'
            }
          }}
        />
        <HelperText
          type="error"
          visible={emailErr}
          style={{
            fontFamily:'Poppins_400Regular',
          }}
        >
          Email inválido
        </HelperText>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="black"
          secureTextEntry={true}
          onChangeText={text => { setSenha(text); setPwErr(false) }}
          underlineColor="transparent"
          theme={{
            colors: {
              primary: 'transparent',
            }
          }}
        />
        <HelperText
          type="error"
          visible={pwErr}
          style={{
            fontFamily:'Poppins_400Regular',
          }}
        >
          A senha deve possuir ao menos 6 caracteres
        </HelperText>
        {loading ? <ActivityIndicator size="small" color="#ff914d" /> : <Button mode="contained" onPress={() => handleValidation()} color='#ff914d' dark={true}>
          Entrar
       </Button>}
          <Text style={styles.textBottom}>Não tem uma conta? <Text onPress={() => navigateToSignUp()} style={{ color: "#ff914d", fontSize: 14 }}>Cadastre-se</Text>.</Text>
      </KeyboardAvoidingView>
    {showAlert && <Alert content={alertContent} setShowAlert={setShowAlert}/>}
    </>
  )
}
