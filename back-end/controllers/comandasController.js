const sequelize = require('../config/mysql/database');
const initModels = require('../models/init-models').initModels
const moment = require("moment")
const { Sequelize, fn, Op, where } = require('sequelize')
const models = initModels(sequelize)
const log = require('../utils/logger')
const QRcode = require('qrcode')

const { getDocs, doc, collection, query, where: firestoreWhere, Timestamp, getDoc, addDoc, updateDoc } = require('firebase/firestore')
const { db } = require('../config/firebase/connect')

async function readComandas () {
    try {
        const comandas = []
        const querySnapshot = await getDocs(collection(db, "comandas"))

        querySnapshot.forEach(async (doc) => {
            comandas.push({ id: doc.id, ...doc.data() })
        })

        return comandas
    } catch (err) {

    }
}

async function readRegistros () {
    try {
        const registros = []
        const querySnapshot = await getDocs(collection(db, "registro"))
        // new Date(el.data_hora.seconds * 1000 + el.data_hora.nanoseconds / 1_000_000
        querySnapshot.forEach(async (doc) => {
            let form =  doc.data().data_hora.seconds * 1000 + doc.data().data_hora.nanoseconds / 1_000_000
            let horaedata = new Date(form)
            registros.push({ id: doc.id, ...doc.data(), data_hora: horaedata.toLocaleString('pt-BR') })
        })

        return registros
    } catch (err) {

    }
}

async function registro (comandaID, exData, tipo) {
    try {
        const comandaRef = doc(db, "comandas", comandaID)
        const referencia = collection(db, "registro")
        const newLog = {
            comanda_id: comandaRef,
            estado_passado: exData,
            tipo: tipo,
            data_hora: Timestamp.now()
        }

        await addDoc(referencia, newLog)
    } catch (err) {
        console.error(err)
    }
}

const getComanda = async (req, res) => {
    try {
        const comandas = await readComandas()

        res.json(comandas)
    } catch (err) {
        console.error("Erro ao buscar comandas: ", err)
        res.status("400").json({ error: err })
    }
}

const getRegistro = async (req, res) => {
    try {
        const registros = await readRegistros()

        res.json(registros)
    } catch (err) {
        console.error("Erro ao buscar o registro: ", err)
        res.status("400").json({ error: err })
    }
}

const postComanda = async (req, res) => {
    const { valueID, valueNome } = req.body;
    try {
        const referencia = doc(db, "comandas", valueID)
        const docSnap = await getDoc(referencia)

        if (docSnap.exists() && !docSnap.data().ativo) {
            await registro (valueID, docSnap.data(), "ativação")

            await updateDoc(referencia, {
                nome: valueNome,
                ativo: true,
                ultima_atualizacao:  Timestamp.now()
            })
            res.json({
                data: "OK"
            })
        } else {
            console.error("Comanda já foi cadastrado por outro usuário.")
            res.json({status: 400, error: "Houve um erro pois esta comanda não existe ou já esta ativa."})
        }
    } catch (err) {
        console.log(err)
    }
}

const disableComanda = async (req, res) => {
    const {valueIDedit} = req.body
    try {
        const referencia = doc(db, "comandas", valueIDedit)
        const docSnap = await getDoc(referencia)

        if (docSnap.exists() && docSnap.data().ativo) {
            await registro (valueIDedit, docSnap.data(), "desativação")

            await updateDoc(referencia, {
                nome: "Desconhecido",
                ativo: false,
                saldo: 0,
                ultima_atualizacao:  Timestamp.now()
            })

            res.json({status: "OK", message: "A comanda foi desativada."})
        } else {
            console.error("Erro ao tentar desativar comanda: comanda nao existe ou nao esta ativada")
            res.json({status: "400", message: "Comanda nao existe ou nao esta ativada."})
        }
    } catch (err) {
        console.error(err)
    }
}

const editComanda = async (req, res) => {
        const {valueIDedit, valueNome} = req.body

    try {
        const referencia = doc(db, "comandas", valueIDedit)
        const docSnap = await getDoc(referencia)

        if (docSnap.exists() && docSnap.data().ativo) {
            await registro (valueIDedit, docSnap.data(), "edição")

            await updateDoc(referencia, {
                nome: valueNome,
                ultima_atualizacao:  Timestamp.now()
            })

            res.json({status: "OK", message: "A comanda foi atualizada."})
        }
    } catch (err) {
        console.error(err)
    }
}

module.exports = { getComanda, postComanda, disableComanda, editComanda, getRegistro }
