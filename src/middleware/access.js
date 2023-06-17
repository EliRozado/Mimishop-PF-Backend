/* -- Middleware para accessos -- */
export const canAccess = (roles) => {
    return (req, res, next) => {
        if(!req.user){
            res.status(404).json({message: 'Not found'})
        }

        let user_role = req.user.role;

        roles.includes(user_role) ? next() : res.status(403).redirect('/403')
    }
}