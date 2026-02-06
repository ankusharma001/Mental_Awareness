const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const g = require('../controllers/groupController');

// Create group
router.post('/create', auth, g.createGroup);
// Join group request
router.post('/request', auth, g.requestJoin);
// My groups
router.get('/my-groups', auth, g.getUserGroups);

// Public / General Member Access
router.get('/', g.getAll);
router.get('/:groupId', auth, g.getGroup);
router.get('/:groupId/messages', auth, g.getMessages);
router.post('/:groupId/messages', auth, g.sendMessage);

// Below: Admin routes (must use :groupId in URL)
// We apply isGroupAdmin separately to each route or use a param-based approach
router.post('/:groupId/approve', auth, g.isGroupAdmin, g.approveJoin);
router.post('/:groupId/reject', auth, g.isGroupAdmin, g.rejectJoin);
router.post('/:groupId/remove', auth, g.isGroupAdmin, g.removeMember);
router.post('/:groupId/block', auth, g.isGroupAdmin, g.blockUser);
router.post('/:groupId/unblock', auth, g.isGroupAdmin, g.unblockUser);
router.delete('/:groupId', auth, g.isGroupAdmin, g.deleteGroup);

module.exports = router;
