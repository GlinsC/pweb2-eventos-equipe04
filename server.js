
import { EventosDatabase } from './database/EventosDatabase.js';
const db = new EventosDatabase();

import express from "express"

const app = express()

app.use(express.json())

//GET QUERY

app.get('/eventos', (req, res) => {

    const {ativo ,modalidade, vagasMin } = req.query

    let eventos = db.listarTodos()


    if (ativo !== undefined) {
        const ativoBoolean = ativo.toLowerCase() === 'true'
        eventos = eventos.filter(evento => evento.ativo === ativoBoolean)
    }// quesito 6

    if (modalidade) {
        eventos = eventos.filter(evento => evento.modalidade === modalidade) // quesito 7
    }

    if (vagasMin) {
        eventos = eventos.filter(evento => evento.vagas >= Number(vagasMin)) // quesito 8
    }

    res.json(eventos) // melhorando essa parte, praficar mais legível
})

app.post('/eventos', (req, res) => {
    const dadosEvento = req.body
    const dadosCadastrado = db.inserir(dadosEvento)
    res.status(201).json(dadosCadastrado)
})


app.put('/eventos/:id', (req, res) => {

    const id = Number(req.params.id)
    const dadosModificado = db.atualizar(id, req.body)

    res.status(200).json(dadosModificado)

})


app.patch('/eventos/:id/cancelar', (req, res) => {

  const id = Number(req.params.id)

  const evento = db.buscarPorId(id)

  if (!evento) {
    return res.status(404).json({
      erro: "Evento não encontrado"
    })
  }

  const eventoAtualizado = db.atualizar(id, { ativo: false })

  res.json({
    mensagem: "Evento cancelado com sucesso",
    evento: eventoAtualizado
  })

})

app.post('/eventos/:id/inscricao', (req, res) => {

  const id = Number(req.params.id)

  const eventoAtualizado = db.reduzirVaga(id)

  if (!eventoAtualizado) {
    return res.status(400).json({
      erro: "Evento não encontrado ou sem vagas disponíveis"
    })
  }

  res.json({
    mensagem: "Inscrição realizada com sucesso",
    evento: eventoAtualizado
  })

})


app.listen(3000)
