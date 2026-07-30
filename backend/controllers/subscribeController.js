const Subscriber = require('../models/subscriber.model.js');
exports.subscribe = async (req, res) => {
const { email } = req.body;
if (!email) return res.status(400).json({ message: "Email is required." });
try {
const existing = await Subscriber.findByEmail(email);
if (existing) return res.status(400).json({ message: "You are already subscribed." });
await Subscriber.create({ email });
res.status(201).json({ message: "Subscription successful! Thank you." });
} catch (e) {
res.status(500).json({ message: "Server Error" });
}
};
exports.getSubscribers = async (req, res) => {
try {
const subscribers = await Subscriber.findAll();
res.json(subscribers);
} catch (e) {
res.status(500).json({ message: "Server Error" });
}
};