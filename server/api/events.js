const router = require('express').Router()
const {Event, Task, Team} = require('../db/models')
module.exports = router

// Get all events
router.get('/', async (req, res, next) => {
  try {
    const events = await Event.findAll()
    res.json(events)
  } catch (err) {
    next(err)
  }
})

// Get single event
router.get('/:id', async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.id, 10)
    const event = await Event.findOne({
      where: {
        id: eventId
      }
    })
    res.json(event)
  } catch (err) {
    next(err)
  }
})

// Get single event and its tasks
router.get('/:id/tasks', async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.id, 10)
    const event = await Event.findOne({
      where: {
        id: eventId
      },
      include: {
        model: Task
      }
    })
    res.json(event)
  } catch (err) {
    next(err)
  }
})

// Get single event and the teams that have joined it
router.get('/:id/teams', async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.id, 10)
    const event = await Event.findOne({
      where: {
        id: eventId
      },
      include: {
        model: Team
      }
    })
    res.json(event)
  } catch (err) {
    next(err)
  }
})

// Create event
router.post('/', async (req, res, next) => {
  try {
    const { name, location, duration } = req.body
    const eventBody = {
      name,
      location,
      duration
    }
    const event = await Event.create(eventBody)
    res.json(event)
  } catch (err) {
    next(err)
  }
})

// Add task to event
router.post('/:eventId/addTask/:taskId', async (req, res, next) => {
  try {
    const {eventId, taskId} = req.params
    const task = await Task.findOne({where: {id: taskId}})
    const event = await Event.findOne({where: {id: eventId}})
    await event.addTask(task)
    res.json(event)
  } catch (err) {
    next(err)
  }
})

// Switch events between active and inactive
router.put('/:eventId', async (req, res, next) => {
  try {
    const { eventId } = req.params
    const event = await Event.findOne({where: {id: eventId}})
    await event.update({
      isActive: !event.isActive
    })
    res.json(event)
  } catch (err) {
    next(err)
  }
})

