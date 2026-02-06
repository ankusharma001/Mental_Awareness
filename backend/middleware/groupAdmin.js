const Group = require('../models/Group');

module.exports = async (req, res, next) => {
  const groupId = req.params.groupId || req.body.groupId;
  if (!groupId) return res.status(400).json({ message: 'Missing group ID.' });
  const group = await Group.findById(groupId);
  if (!group) return res.status(404).json({ message: 'Group not found.' });
  if (group.admin.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Only group admin can perform this action.' });
  }
  req.group = group;
  next();
};
