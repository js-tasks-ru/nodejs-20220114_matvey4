const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');


module.exports.register = async (ctx, next) => {
    const verificationToken = uuid();
    const {email, displayName, password} = ctx.request.body
    const user = await User.create({email, displayName, verificationToken})
    await user.setPassword(password)
    await user.save();

    await sendMail({
               template: 'confirmation',
               locals: {token: 'token'},
               to: email,
               subject: 'Подтвердите почту',
             });

    ctx.status = 200;
    ctx.body = {status: 'ok'};
};

module.exports.confirm = async (ctx, next) => {
    const {verificationToken} = ctx.request.body;

    const user = await User.findOne({verificationToken});

    if (!user) {
        ctx.status = 400;
        ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};
        return;
    }

    user.verificationToken =  undefined;
    await user.save();

    const token = ctx.login(user);
    ctx.status = 200;
    ctx.body = {token: token};
    return next();
};
