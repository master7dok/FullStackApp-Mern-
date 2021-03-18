const {Router} = require('express')
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const router = Router()

// /api/auth/register
router.post('/register',
    [
        check('email', 'Невірний email').isEmail(),
        check('password', 'Мінімальна довжина пароля 6 сим')
            .isLength({ min:6 })
    ],
    async (req, res) => {

    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некоректні дані при реєстрації'
            })
        }

        const {email, password} = req.body

        const candidate = await User.findOne({email})
        if (candidate) {
            return res.status(400).json({message: 'Такий користувач вже існує'})
        }

        const hashPassword = await bcrypt.hash(password, 12)
        const  user = new User({email, password: hashPassword})

        await user.save()

        res.status(201).json({ message: 'Користувач створений'} )
    }
    catch (e) {
        res.status(500).json({ message: 'Error' })
    }
})

// /api/auth/login
router.post('/login', async (req, res) => {

})

module.exports = router
