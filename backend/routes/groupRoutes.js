const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const auth = require('../middleware/auth');
const groupAdmin = require('../middleware/groupAdmin');

// Create group
router.post('/create', auth, groupController.createGroup);
// Request to join
router.post('/request', auth, groupController.requestToJoin);
// Get user groups
router.get('/my-groups', auth, groupController.getUserGroups);
// Admin accept request
router.post('/:groupId/accept', auth, groupAdmin, groupController.acceptRequest);
// Admin reject request
router.post('/:groupId/reject', auth, groupAdmin, groupController.rejectRequest);
// Admin remove member
router.post('/:groupId/remove', auth, groupAdmin, groupController.removeMember);
// Admin delete group
router.delete('/:groupId', auth, groupAdmin, groupController.deleteGroup);

module.exports = router;
