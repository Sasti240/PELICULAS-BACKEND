const { Router } = require('express');
const Media = require('../models/Media');
const { validationResult, check } = require('express-validator');
const Genero = require('../models/Genero');
const Director = require('../models/Director');
const Productora = require('../models/Productora');
const Tipo = require('../models/Tipo');

const router = Router();

router.get('/', async function (req, res) {
    try {
        const medias = await Media.find()
            .populate('genero', 'nombre')
            .populate('director', 'nombre')
            .populate('productora', 'nombre')
            .populate('tipo', 'nombre');
        res.send(medias);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al obtener las producciones.');
    }
});

router.post('/', [
    check('serial', 'El serial es requerido').not().isEmpty(),
    check('titulo', 'El título es requerido').not().isEmpty(),
    check('sinopsis', 'La sinopsis es requerida').not().isEmpty(),
    check('url', 'La URL es requerida').not().isEmpty(),
    check('imagen', 'La imagen es requerida').not().isEmpty(),
    check('anioEstreno', 'El año de estreno es requerido').isNumeric(),
    check('genero', 'El género es requerido y debe ser activo').not().isEmpty().custom(async (value) => {
        const genero = await Genero.findById(value);
        if (!genero || genero.estado !== 'Activo') {
            throw new Error('Género no válido o inactivo');
        }
    }),
    check('director', 'El director es requerido y debe ser activo').not().isEmpty().custom(async (value) => {
        const director = await Director.findById(value);
        if (!director || director.estado !== 'Activo') {
            throw new Error('Director no válido o inactivo');
        }
    }),
    check('productora', 'La productora es requerida y debe ser activa').not().isEmpty().custom(async (value) => {
        const productora = await Productora.findById(value);
        if (!productora || productora.estado !== 'Activo') {
            throw new Error('Productora no válida o inactiva');
        }
    }),
    check('tipo', 'El tipo es requerido').not().isEmpty().custom(async (value) => {
        const tipo = await Tipo.findById(value);
        if (!tipo) {
            throw new Error('Tipo no válido');
        }
    })
], async function (req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() });
        }

        const media = new Media({
            serial: req.body.serial,
            titulo: req.body.titulo,
            sinopsis: req.body.sinopsis,
            url: req.body.url,
            imagen: req.body.imagen,
            fechaCreacion: new Date(),
            fechaActualizacion: new Date(),
            anioEstreno: req.body.anioEstreno,
            genero: req.body.genero,
            director: req.body.director,
            productora: req.body.productora,
            tipo: req.body.tipo
        });

        const resultado = await media.save();
        res.send(resultado);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al crear la producción.');
    }
});

router.put('/:mediaId', async function (req, res) {
    try {
        const media = await Media.findById(req.params.mediaId);
        if (!media) {
            return res.status(404).send('Producción no encontrada');
        }

        media.titulo = req.body.titulo || media.titulo;
        media.sinopsis = req.body.sinopsis || media.sinopsis;
        media.url = req.body.url || media.url;
        media.imagen = req.body.imagen || media.imagen;
        media.anioEstreno = req.body.anioEstreno || media.anioEstreno;
        media.genero = req.body.genero || media.genero;
        media.director = req.body.director || media.director;
        media.productora = req.body.productora || media.productora;
        media.tipo = req.body.tipo || media.tipo;
        media.fechaActualizacion = new Date();

        const resultado = await media.save();
        res.send(resultado);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al actualizar la producción.');
    }
});

module.exports = router;