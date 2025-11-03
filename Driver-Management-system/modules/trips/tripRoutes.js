const router = require('express').Router();
const Trip = require('./tripModel');
const validateTrip = require('./tripValidation');
const { buildQuery, buildSort, buildPaginate } = require('../query.utils');


router.post('/', validateTrip, async (req, res, next) => {
  try { res.status(201).json(await Trip.create(req.body)); }
  catch (e) { next(e); }
});


router.get('/', async (req, res, next) => {
  try {
    const query = { ...buildQuery(req.query) };
    if (req.query.status) query.status = req.query.status;
    if (req.query.driver) query.driver = req.query.driver;
    if (req.query.vehicle) query.vehicle = req.query.vehicle;

   
    if (req.query.from || req.query.to) {
      query.startTime = {};
      if (req.query.from) query.startTime.$gte = new Date(req.query.from);
      if (req.query.to) query.startTime.$lte = new Date(req.query.to);
    }

    const sort = buildSort(req.query);
    const { page, limit, skip } = buildPaginate(req.query);

    const [items, total] = await Promise.all([
      Trip.find(query)
        .populate('driver', 'name licenseNumber')
        .populate('vehicle', 'plate make model')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Trip.countDocuments(query)
    ]);

    res.json({ page, limit, total, pages: Math.ceil(total / limit), items });
  } catch (e) { next(e); }
});


router.get('/:id', async (req, res, next) => {
  try {
    const doc = await Trip.findById(req.params.id)
      .populate('driver', 'name licenseNumber')
      .populate('vehicle', 'plate make model');
    if (!doc) return res.status(404).json({ message: 'Trip not found' });
    res.json(doc);
  } catch (e) { next(e); }
});

router.put('/:id', validateTrip, async (req, res, next) => {
  try {
    const doc = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ message: 'Trip not found' });
    res.json(doc);
  } catch (e) { next(e); }
});


router.delete('/:id', async (req, res, next) => {
  try {
    const doc = await Trip.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Trip not found' });
    res.status(204).send();
  } catch (e) { next(e); }
});

module.exports = router;
