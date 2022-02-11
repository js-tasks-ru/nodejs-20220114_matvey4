const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {
        const user = await User.findOne({email: email});
        if (!user) {
            done(null, false, 'Нет такого пользователя');
        }

        const isPasswordOk = await user.checkPassword(password)

       if (!isPasswordOk){
           done(null, false, 'Неверный пароль');
       }

        done(null, user);
    },
);
