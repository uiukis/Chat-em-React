import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';

import { Container, Conteudo, Header, Form, Campo, Label, Input, Select, BtnAcessar, HeaderChat, ImgUsuario, NomeUsuario, ChatBox, ConteudoChat, MsgEnviada, DetMsgEnviada, TextoMsgEnviada, MsgRecebida, DetMsgRecebida, TextoMsgRecebida, EnviarMsg, CampoMsg, BtnEnviarMsg } from './styles/styles';

let socket;

function App() {

  const ENDPOINT = "http://localhost:8080/";

  const [logado, setLogado] = useState(false);
  const [nome, setNome] = useState("");
  const [sala, setSala] = useState("");

  /*const [logado, setLogado] = useState(true);
  const [nome, setNome] = useState("Wilker");
  const [sala, setSala] = useState("1");*/

  const [mensagem, setMensagem] = useState("");
  const [listaMensagem, setListaMensagem] = useState([]);

  useEffect(() => {
    socket = socketIOClient(ENDPOINT);
  }, []);

  useEffect(() => {
    socket.on("receber_mensagem", (dados) => {
      setListaMensagem([...listaMensagem, dados]);
    });
  });

  const conectarSala = () => {
    console.log("Acessou a sala " + sala + " com o usuário " + nome);
    setLogado(true);
    socket.emit("sala_conectar", sala);
  }

  const enviarMensagem = async () => {
    console.log("Mensagem: " + mensagem);
    const conteudoMensagem = {
      sala,
      conteudo: {
        nome,
        mensagem
      }
    }
    console.log(conteudoMensagem);

    await socket.emit("enviar_mensagem", conteudoMensagem);
    setListaMensagem([...listaMensagem, conteudoMensagem.conteudo]);
    setMensagem("");
  }

  return (
    <Container>
      {!logado ?
        <Conteudo>
          <Header>Meu chat sobre...</Header>
          <Form>
            <Campo>
              <Label>Nome: </Label>
              <Input type="text" placeholder="Nome" name="nome" value={nome} onChange={(texto) => { setNome(texto.target.value) }} />
            </Campo>

            <Campo>
              <Label>Sala: </Label>
              <Select name="sala" value={sala} onChange={texto => setSala(texto.target.value)}>
                <option value="">Selecione</option>
                <option value="1">Sala 01</option>
                <option value="2">Sala 02</option>
                <option value="3">Sala 03</option>
                <option value="4">Sala 04</option>
              </Select>
            </Campo>

            <BtnAcessar onClick={conectarSala}>Acessar</BtnAcessar>
          </Form>
        </Conteudo>
        :
        <ConteudoChat>
          <HeaderChat>
            <ImgUsuario src="1.jpg" alt={nome} />
            <NomeUsuario>{nome}</NomeUsuario>
          </HeaderChat>
          <ChatBox>
            {listaMensagem.map((msg, key) => {
              return (
                <div key={key}>
                  {nome === msg.nome ?
                    <MsgEnviada>
                      <DetMsgEnviada>
                        <TextoMsgEnviada>{msg.nome} : {msg.mensagem}</TextoMsgEnviada>
                      </DetMsgEnviada>
                    </MsgEnviada>
                    :
                    <MsgRecebida>
                      <DetMsgRecebida>
                        <TextoMsgRecebida>{msg.nome} : {msg.mensagem}</TextoMsgRecebida>
                      </DetMsgRecebida>
                    </MsgRecebida>
                  }
                </div>
              )
            })}

          </ChatBox>
          <EnviarMsg>
            <CampoMsg type="text" name="mensagem" placeholder="Mensagem..." value={mensagem} onChange={(texto) => { setMensagem(texto.target.value) }} />

            <BtnEnviarMsg type="button" onClick={enviarMensagem}>Enviar</BtnEnviarMsg>
          </EnviarMsg>
        </ConteudoChat>
      }
    </Container>
  );
}

export default App;
