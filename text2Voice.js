const axios = require('axios')
const fs = require('fs')


const getVoice = async ({
    tex,
    lan,
    cuid,
    ctp,
    tok,
    spd = 5,
    pit = 5,
    vol = 5,
    per = 0
}) => {
    const url = 'http://tsn.baidu.com/text2audio'
    const res = await axios.get(`${url}?tex=${tex}&lan=${lan}&cuid=${cuid}&ctp=${ctp}&tok=${tok}&spd=${spd}&pit=${pit}&vol=${vol}&per=${per}`, {
        responseType: 'arraybuffer'
    })
    console.log(`${url}?
    tex=${tex}&lan=${lan}&cuid=${cuid}&ctp=${ctp}&tok=${tok}&spd=${spd}&pit=${pit}&vol=${vol}&per=${per}`)
    return res.data
}

const text2Voice = async ({
    tex,
    lan,
    spd,
    pit,
    vol,
    per
}) => {
    const url = 'https://openapi.baidu.com/oauth/2.0/token'
    const grant_type = 'client_credentials'
    const client_id = '8lP24ovQbqtTDI5NOZpali7P'
    const client_secret = '735e21507fb64da0b19970547ee49cc4'
    let res = await axios.get(`${url}?grant_type=${grant_type}&client_id=${client_id}&client_secret=${client_secret}`)
    return await getVoice({
        tex: encodeURI(tex),
        lan,
        cuid: 'wo',
        ctp: '1',
        tok: res.data.access_token,
        spd,
        pit,
        vol,
        per
    })

}

module.exports = text2Voice

// text2Voice({
//     tex: '233333',
//     lan: 'en'
// })