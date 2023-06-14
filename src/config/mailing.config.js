import nodemailer from 'nodemailer';
import config from './envVariables.js';

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.SYS_EMAIL,
        pass: config.SYS_EMAIL_PASS
    }
})

export const passwordRecoveryEmail = async (user_email, link) => {
    await transport.sendMail({
        from: `System Admin <${config.SYS_EMAIL}>`,
        to: `${user_email}`,
        subject: 'Password Recovery',
        html: `<h1>Password Recovery Request</h1>
        <p>Did you forget your password? If so, please click the button below to create a new one.If you did not lose your password, Link will expire in one hour.</p>
        <a href="http://localhost:3000/pwdrecover/${link}" target="_blank" class="v-button" style="box-sizing: border-box;display: inline-block;font-family:arial,helvetica,sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #3AAEE0; border-radius: 4px;-webkit-border-radius: 4px; -moz-border-radius: 4px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;font-size: 14px;">
            <span style="display:block;padding:10px 20px;line-height:120%;"><span style="line-height: 16.8px;">Recover Password</span></span>
        </a>
        <p>If you didn't request to recover your password, please dismiss this email.</p>`,
        attachments: []
    })
}

export const deletedAccount = async (user) => {
    await transport.sendMail({
        from: `System Admin <${config.SYS_EMAIL}>`,
        to: `${user.email}`,
        subject: 'Account terminated',
        html: `<h1>Your account has been terminated.</h1>
        <p>We noticed you haven't used your account for a while, for security we have deleted your account.</p>
        <p>You are free to register again at our site if you wish to make another purchase.</p>
        `
    })
}

export const deletedProduct = async (product) => {
    await transport.sendMail({
        from: `System Admin <${config.SYS_EMAIL}>`,
        to: `${product.owner}`,
        subject: 'Product deleted',
        html: `<h1>A product you own has been deleted.</h1>
        <p>The Product ${product.title} has been deleted.</p>
        <p>If you were the one to delete this item, dismiss this email.</p>
        <p>If you didn't delete this item yourself, there is a chance an admin did so. You are free to contact the system admin for more information.</p>
        `
    })
}