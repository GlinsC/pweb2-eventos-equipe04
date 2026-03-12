
import { EventosDatabase } from './database/EventosDatabase.js';
const db = new EventosDatabase();

import express from "express"

const app = express()

app.use(express.json())

app.get('/eventos', (req, res) => {

    const { modalidade, vagasMin } = req.query

    let eventos = db.listarTodos()

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
    console.log(req.params)
    const {id} = req.params
    
    const dadosModificado = db.atualizar(id, req.body)
    res.status(200).json(dadosModificado)
})

app.listen(3000)
