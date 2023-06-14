/* -- Middleware para accessos -- */
export const canAccess = (roles) => {
    return (req, res, next) => {
        if(!req.user){
            res.status(404).json({message: 'Not found'})
        }

        let user_role = req.user.role;

        roles.includes(user_role) ? next() : res.status(403).json({error: 'FORBIDDEN', message: `Only users with the roles ${roles} can do this action`}) 
    }
}