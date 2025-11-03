const router = require('express').Router();
const Driver = require('./driverModel');
const validateDriver = require('./driverValidation');
const { buildQuery, buildSort, buildPaginate } = require('../query.utils');


router.post('/', validateDriver, async (req, res, next) => {
  try {
    const doc = await Driver.create(req.body);
    res.status(201).json(doc);
  } catch (e) { next(e); }
});


router.get('/', async (req, res, next) => {
  try {
    const query = { ...buildQuery(req.query) };
    if (req.query.status) query.status = req.query.status;

    const sort = buildSort(req.query);
    const { page, limit, skip } = buildPaginate(req.query);

    const [items, total] = await Promise.all([
      Driver.find(query).sort(sort).skip(skip).limit(limit),
      Driver.countDocuments(query)
    ]);

    res.json({ page, limit, total, pages: Math.ceil(total / limit), items });
  } catch (e) { next(e); }
});


router.get('/:id', async (req, res, next) => {
  try {
    const doc = await Driver.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Driver not found' });
    res.json(doc);
  } catch (e) { next(e); }
});


router.put('/:id', validateDriver, async (req, res, next) => {
  try {
    const doc = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ message: 'Driver not found' });
    res.json(doc);
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const doc = await Driver.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Driver not found' });
    res.status(204).send();
  } catch (e) { next(e); }
});

module.exports = router;
