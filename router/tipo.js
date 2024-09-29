const { Router } = require('express');
const Tipo = require('../models/Tipo');
const { validationResult, check } = require('express-validator');

const router = Router();

router.get('/', async function (req, res) {
    try {
        const tipos = await Tipo.find();
        res.send(tipos);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al obtener los tipos.');
    }
});

router.post('/', [
    check('nombre', 'El nombre del tipo es requerido').not().isEmpty(),
    check('descripcion', 'La descripción es requerida').not().isEmpty(),
], async function (req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() });
        }

        const tipo = new Tipo({
            nombre: req.body.nombre,
            fechaCreacion: req.body.fechaCreacion || new Date(),
            fechaActualizacion: req.body.fechaActualizacion || new Date(),
            descripcion: req.body.descripcion
        });

        const resultado = await tipo.save();
        res.send(resultado);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al crear el tipo.');
    }
});

router.put('/:tipoId', [
    check('nombre', 'El nombre del tipo es requerido').not().isEmpty(),
    check('descripcion', 'La descripción es requerida').not().isEmpty(),
], async function (req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() });
        }

        let tipo = await Tipo.findById(req.params.tipoId);
        if (!tipo) {
            return res.status(404).send('Tipo no encontrado');
        }

        tipo.nombre = req.body.nombre || tipo.nombre;
        tipo.descripcion = req.body.descripcion || tipo.descripcion;
        tipo.fechaActualizacion = new Date();

        const resultado = await tipo.save();
        res.send(resultado);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al actualizar el tipo.');
    }
});

router.delete('/:tipoId', async (req, res) => {
    try {
        const tipo = await Tipo.findByIdAndDelete(req.params.tipoId);
        if (!tipo) {
            return res.status(404).send('Tipo no encontrado');
        }
        res.send('Tipo eliminado exitosamente');
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al eliminar el tipo.');
    }
});

module.exports = router;