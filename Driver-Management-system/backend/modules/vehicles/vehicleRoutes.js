const router = require('express').Router();
const Vehicle = require('./vehicleModel');
const validateVehicle = require('./vehicleValidation');
const { buildQuery, buildSort, buildPaginate } = require('../query.utils');


router.post('/', validateVehicle, async (req, res, next) => {
  try { res.status(201).json(await Vehicle.create(req.body)); }
  catch (e) { next(e); }
});


router.get('/', async (req, res, next) => {
  try {
    const query = { ...buildQuery(req.query) };
    if (req.query.status) query.status = req.query.status;

    const sort = buildSort(req.query);
    const { page, limit, skip } = buildPaginate(req.query);

    const [items, total] = await Promise.all([
      Vehicle.find(query).sort(sort).skip(skip).limit(limit),
      Vehicle.countDocuments(query)
    ]);

    res.json({ page, limit, total, pages: Math.ceil(total / limit), items });
  } catch (e) { next(e); }
});


router.get('/:id', async (req, res, next) => {
  try {
    const doc = await Vehicle.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(doc);
  } catch (e) { next(e); }
});


router.put('/:id', validateVehicle, async (req, res, next) => {
  try {
    const doc = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(doc);
  } catch (e) { next(e); }
});


router.delete('/:id', async (req, res, next) => {
  try {
    const doc = await Vehicle.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Vehicle not found' });
    res.status(204).send();
  } catch (e) { next(e); }
});

module.exports = router;
