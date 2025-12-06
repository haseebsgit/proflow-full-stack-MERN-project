// server/middleware/roleMiddleware.js

// This middleware checks if the user's role is included in the roles array passed to it.
const authorize = (roles = []) => {
    // Ensure 'roles' is an array
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        // req.user is populated by the 'protect' middleware
        if (!req.user || (roles.length > 0 && !roles.includes(req.user.role))) {
            return res.status(403).json({ 
                message: `User role (${req.user ? req.user.role : 'None'}) is not authorized to perform this action.` 
            });
        }

        next();
    };
};

module.exports = { authorize };