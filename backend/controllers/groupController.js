const Group = require('../models/Group');
const User = require('../models/User');

// Create group
exports.createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    const group = await Group.create({
      name,
      description,
      admin: req.user._id,
      members: [req.user._id],
      joinRequests: [],
    });
    res.status(201).json(group);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Request to join group
exports.requestToJoin = async (req, res) => {
  try {
    const { groupId } = req.body;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    if (group.members.includes(req.user._id)) return res.status(400).json({ message: 'Already a member' });
    if (group.joinRequests.includes(req.user._id)) return res.status(400).json({ message: 'Request already sent' });
    group.joinRequests.push(req.user._id);
    await group.save();
    res.json({ message: 'Join request sent' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get user's joined groups and created groups
exports.getUserGroups = async (req, res) => {
  try {
    const userId = req.user._id;
    const groups = await Group.find({
      $or: [
        { admin: userId },
        { members: userId }
      ]
    }).populate('admin', 'username avatar');
    res.json(groups);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Admin accepts join request
exports.acceptRequest = async (req, res) => {
  try {
    const { requestUserId } = req.body;
    const group = req.group;
    const idx = group.joinRequests.indexOf(requestUserId);
    if (idx === -1) return res.status(400).json({ message: 'No such join request' });
    group.joinRequests.splice(idx, 1);
    group.members.push(requestUserId);
    await group.save();
    res.json({ message: 'User added to group' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Admin rejects join request
exports.rejectRequest = async (req, res) => {
  try {
    const { requestUserId } = req.body;
    const group = req.group;
    const idx = group.joinRequests.indexOf(requestUserId);
    if (idx === -1) return res.status(400).json({ message: 'No such join request' });
    group.joinRequests.splice(idx, 1);
    await group.save();
    res.json({ message: 'Join request rejected' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Admin removes member
exports.removeMember = async (req, res) => {
  try {
    const { memberId } = req.body;
    const group = req.group;
    if (!group.members.includes(memberId)) return res.status(400).json({ message: 'User not a member' });
    if (memberId === group.admin.toString()) return res.status(400).json({ message: 'Cannot remove admin' });
    group.members = group.members.filter(id => id.toString() !== memberId);
    await group.save();
    res.json({ message: 'Member removed' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Admin deletes group
exports.deleteGroup = async (req, res) => {
  try {
    const group = req.group;
    await group.remove();
    res.json({ message: 'Group deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
