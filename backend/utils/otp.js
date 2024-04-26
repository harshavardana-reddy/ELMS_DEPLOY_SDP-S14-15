const otpgenerator = require('otp-generator')

const genotp = ()=>{
    const OTP = otpgenerator.generate(6,{
        upperCaseAlphabets: false,
        specialChars:false,
        lowerCaseAlphabets: false,
    })
    return OTP
}
module.exports = genotp

