"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const path_1 = __importDefault(require("path"));
const mailer_1 = require("../config/mailer");
const promises_1 = require("fs/promises");
async function sendEmail({ to, subject, templatePath, variables = {}, }) {
    const filePath = path_1.default.resolve(__dirname, "..", "template", templatePath ?? "simple.html");
    let template = await (0, promises_1.readFile)(filePath, "utf-8");
    for (const [key, value] of Object.entries(variables)) {
        template = template.replace(new RegExp(`{{\\s*${key}\\s*}}`, "g"), value);
    }
    const info = await mailer_1.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject,
        html: template,
    });
    return info;
}
