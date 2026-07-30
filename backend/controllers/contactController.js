const Message = require('../models/message.model.js');

exports.submitMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;
  try {
    await Message.create({ name, email, subject, message });
    res.status(201).json({ message: 'Message sent successfully!' });
  } catch (e) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.findAll();
    res.json(messages);
  } catch (e) {
    res.status(500).json({ message: "Server Error" });
  }
};