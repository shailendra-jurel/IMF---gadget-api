const Gadget = require('../models/gadget');
const { generateCodename, generateMissionProbability } = require('../utils/generateCodename');
const { v4: uuidv4 } = require('uuid');

exports.getAllGadgets = async (req, res) => {
  try {
    const { status } = req.query;
    const whereCondition = status ? { status } : {};

    const gadgets = await Gadget.findAll({
      where: whereCondition,
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    const gadgetsWithProbability = gadgets.map(gadget => ({
      ...gadget.toJSON(),
      missionSuccessProbability: generateMissionProbability()
    }));

    res.json(gadgetsWithProbability);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving gadgets', error: error.message });
  }
};

exports.createGadget = async (req, res) => {
  try {
    const { name } = req.body;
    const newGadget = await Gadget.create({
      id: uuidv4(),
      name,
      codename: generateCodename(),
      missionSuccessProbability: generateMissionProbability()
    });

    res.status(201).json(newGadget);
  } catch (error) {
    res.status(400).json({ message: 'Error creating gadget', error: error.message });
  }
};

exports.updateGadget = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;

    const [updated] = await Gadget.update(
      { name, status },
      { where: { id } }
    );

    if (updated) {
      const updatedGadget = await Gadget.findByPk(id);
      res.json(updatedGadget);
    } else {
      res.status(404).json({ message: 'Gadget not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating gadget', error: error.message });
  }
};

exports.decommissionGadget = async (req, res) => {
  try {
    const { id } = req.params;

    const [updated] = await Gadget.update(
      { 
        status: 'Decommissioned', 
        decommissionedAt: new Date() 
      },
      { where: { id } }
    );

    if (updated) {
      res.json({ message: 'Gadget decommissioned successfully' });
    } else {
      res.status(404).json({ message: 'Gadget not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error decommissioning gadget', error: error.message });
  }
};

exports.selfDestruct = async (req, res) => {
  try {
    const { id } = req.params;
    const { confirmationCode } = req.body;

    // Simulate confirmation code generation
    const expectedCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    if (confirmationCode !== expectedCode) {
      return res.status(400).json({ message: 'Invalid confirmation code' });
    }

    const [updated] = await Gadget.update(
      { 
        status: 'Destroyed', 
        decommissionedAt: new Date() 
      },
      { where: { id } }
    );

    if (updated) {
      res.json({ 
        message: 'Self-destruct sequence initiated',
        expectedCode 
      });
    } else {
      res.status(404).json({ message: 'Gadget not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error initiating self-destruct', error: error.message });
  }
};