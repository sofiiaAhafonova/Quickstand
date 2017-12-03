const auth = require('basic-auth')
const User = require('../../models/User')


module.exports.authCheck = async(req, res, next) => {
    try {
        const credentials = auth.parse(req.headers.authorization)
        if (!credentials) {
            res.status(400)
                .json({
                    message: 'Missing credentials',
                    success: false
                })
        }
        const name = credentials.name.trim()
        const password = credentials.pass.trim()
        const user = await User.findOne({
            name
        })
        if (!user) {
            return res.status(401)
                .json({
                    message: 'No such user',
                    success: false
                })
        }
        if (!user.comparePassword(password)) {
            return res.status(401)
                .json({
                    message: 'Incorrect password',
                    success: false
                })
        }
        res.locals.user = user
        next()
    } catch (error) {
        res.sendStatus(500)
    }
}


module.exports.adminCheck = (req, res, next) => res.locals.user.role === 'admin' ?
    next() :
    res.status(403).json({
        success: false,
        message: 'You should have admin permissions.'
    })