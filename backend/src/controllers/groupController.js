const Group = require('../models/Group');
const User = require('../models/User');
const Message = require('../models/Message');

// Send message to group
exports.sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const { groupId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const isMember = group.members.some(m => m.toString() === req.user._id.toString());
    const isAdmin = group.admin.toString() === req.user._id.toString();
    const isBlocked = group.blocked.some(m => m.toString() === req.user._id.toString());

    if (isBlocked) {
      return res.status(403).json({ message: 'You are blocked from this group' });
    }

    if (!isMember && !isAdmin) {
      return res.status(403).json({ message: 'Not a member of this group' });
    }

    const message = await Message.create({
      group: groupId,
      sender: req.user._id,
      content
    });

    await message.populate('sender', 'username avatar');
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message' });
  }
};

// Get group messages
exports.getMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const isMember = group.members.some(m => m.toString() === req.user._id.toString());
    const isAdmin = group.admin.toString() === req.user._id.toString();
    const isBlocked = group.blocked.some(m => m.toString() === req.user._id.toString());

    if (isBlocked) {
      return res.status(403).json({ message: 'You are blocked from this group' });
    }

    if (!isMember && !isAdmin) {
      return res.status(403).json({ message: 'Not a member of this group' });
    }

    const messages = await Message.find({ group: groupId })
      .populate('sender', 'username avatar')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};

// Create group
exports.createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Group name required' });
    const exists = await Group.findOne({ name });
    if (exists) return res.status(400).json({ message: 'Group name taken' });
    const group = await Group.create({
      name,
      description,
      admin: req.user._id,
      members: [req.user._id],
    });
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ message: 'Create group failed' });
  }
};

// Request to join a group
exports.requestJoin = async (req, res) => {
  try {
    const { groupId } = req.body;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    if (group.blocked.includes(req.user._id)) return res.status(403).json({ message: 'You are blocked' });
    if (group.members.includes(req.user._id)) return res.status(400).json({ message: 'Already a member' });
    if (group.joinRequests.includes(req.user._id)) return res.status(400).json({ message: 'Request pending' });
    group.joinRequests.push(req.user._id);
    await group.save();
    res.json({ message: 'Join request sent' });
  } catch (err) {
    res.status(500).json({ message: 'Failed' });
  }
};

// Middleware: group admin check
exports.isGroupAdmin = async (req, res, next) => {
  const group = await Group.findById(req.params.groupId);
  if (!group) return res.status(404).json({ message: 'Group not found' });
  if (group.admin.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not group admin' });
  }
  req.group = group;
  next();
};

// Admin: approve join
exports.approveJoin = async (req, res) => {
  const { userId } = req.body;
  const group = req.group;
  if (!group.joinRequests.includes(userId)) return res.status(400).json({ message: 'No join request' });
  group.joinRequests = group.joinRequests.filter(u => u.toString() !== userId);
  group.members.push(userId);
  await group.save();
  res.json({ message: 'User approved' });
};

// Admin: reject join
exports.rejectJoin = async (req, res) => {
  const { userId } = req.body;
  const group = req.group;
  if (!group.joinRequests.includes(userId)) return res.status(400).json({ message: 'No join request' });
  group.joinRequests = group.joinRequests.filter(u => u.toString() !== userId);
  await group.save();
  res.json({ message: 'Join request rejected' });
};

// Admin: remove member
exports.removeMember = async (req, res) => {
  const { userId } = req.body;
  const group = req.group;
  if (!group.members.includes(userId)) return res.status(400).json({ message: 'Not a member' });
  if (userId == group.admin.toString()) return res.status(400).json({ message: 'Cannot remove admin' });
  group.members = group.members.filter(u => u.toString() !== userId);
  await group.save();
  res.json({ message: 'User removed' });
};

// Admin: block user (Shadow ban/mute)
exports.blockUser = async (req, res) => {
  const { userId } = req.body;
  const group = req.group;

  // Use string comparison for safety with ObjectIds
  const alreadyBlocked = group.blocked.some(id => id.toString() === userId.toString());
  if (alreadyBlocked) return res.status(400).json({ message: 'Already restricted' });

  group.blocked.push(userId);

  // Ensure they STAY in members so admin can still see them
  const isMember = group.members.some(id => id.toString() === userId.toString());
  if (!isMember) {
    group.members.push(userId);
  }

  // Clear from join requests
  group.joinRequests = group.joinRequests.filter(u => u.toString() !== userId.toString());

  await group.save();
  res.json({ message: 'User restricted successfully' });
};

// Admin: unblock user
exports.unblockUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const group = req.group;

    // Remove from blocked list
    group.blocked = group.blocked.filter(id => id.toString() !== userId.toString());

    // Restoration: Ensure they are in the members list
    const isMember = group.members.some(id => id.toString() === userId.toString());
    if (!isMember) {
      group.members.push(userId);
    }

    await group.save();
    console.log(`User ${userId} was un-restricted in group ${group._id}`);
    res.json({ message: 'User access restored' });
  } catch (err) {
    res.status(500).json({ message: 'Unblocking failed' });
  }
};

// Admin: delete group (Permanently removes group and messages, but NOT users)
exports.deleteGroup = async (req, res) => {
  try {
    const groupId = req.group._id;

    // 1. Delete all messages associated with this group
    await Message.deleteMany({ group: groupId });

    // 2. Delete the group itself
    await Group.deleteOne({ _id: groupId });

    console.log(`Group ${groupId} and its messages were permanently deleted.`);
    res.json({ message: 'Group and all associated data deleted permanently. Users remain intact.' });
  } catch (err) {
    console.error('Group deletion error:', err);
    res.status(500).json({ message: 'Failed to delete group' });
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
    res.status(500).json({ message: 'Failed to fetch user groups' });
  }
};

// GET all groups
exports.getAll = async (req, res) => {
  const groups = await Group.find().populate('admin', 'username').sort({ createdAt: -1 });
  res.json(groups);
};

// GET group detail
exports.getGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .populate('admin', 'username')
      .populate('members', 'username')
      .populate('joinRequests', 'username')
      .populate('blocked', 'username'); // CRITICAL: Populate blocked users

    if (!group) return res.status(404).json({ message: 'Group not found' });
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch group' });
  }
};
