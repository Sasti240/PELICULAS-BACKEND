const { Router } = require('express');
const Genero = require('../models/Genero');
const { validationResult, check } = require('express-validator');

const router = Router();

router.get('/', async function (req, res) {
    try {
        const generos = await Genero.find();
        res.send(generos);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error');
    }
});

router.post('/', [
    check('nombre', 'El nombre es requerido').not().isEmpty(),
    check('descripcion', 'La descripción es requerida').not().isEmpty(),
    check('estado', 'Estado inválido').isIn(['Activo', 'Inactivo']),
], async function (req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() });
        }

        const genero = new Genero({
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            estado: req.body.estado,
            fechaCreacion: req.body.fechaCreacion || new Date(),
            fechaActualizacion: req.body.fechaActualizacion || new Date()
        });

        const resultado = await genero.save();
        res.send(resultado);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al crear el género');
    }
});

router.put('/:generoId', [
    check('nombre', 'El nombre es requerido').not().isEmpty(),
    check('descripcion', 'La descripción es requerida').not().isEmpty(),
    check('estado', 'Estado inválido').isIn(['Activo', 'Inactivo']),
], async function (req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() });
        }

        let genero = await Genero.findById(req.params.generoId);
        if (!genero) {
            return res.status(404).send('Género no encontrado');
        }

        genero.nombre = req.body.nombre;
        genero.descripcion = req.body.descripcion;
        genero.estado = req.body.estado;
        genero.fechaActualizacion = new Date();

        genero = await genero.save();
        res.send(genero);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al actualizar el género');
    }
});

router.delete('/:generoId', async function (req, res) {
    try {
        const genero = await Genero.findByIdAndDelete(req.params.generoId);
        if (!genero) {
            return res.status(404).send('Género no encontrado');
        }
        res.send('Género eliminado con éxito');
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al eliminar el género.');
    }
});

module.exports = router;