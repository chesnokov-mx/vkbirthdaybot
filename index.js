//maybeFinalVersion
const easyvk = require('easyvk')
const path = require('path');
const fs = require("fs");
require('dotenv').config()

const ctnToChar = new Map([[0, "П"],[1,"О"], [2,"З"],[3,'Д'],[4,'Р'],[5,'А'],[6,'В'],[7,'Л'],[8,'Я'],[9,'Ю'],
                                    [10,'С'],[11,"Днем рождения! Пусть в жизни будут только удача, мир и радость, чтобы каждый новый день был праздником! И пусть мечты обязательно станут реальностью! Здоровья, успеха, любви и всего самого лучшего!"]])


function getCurrentDate(){
    let date_ob = new Date(Date.now());
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    return [date, month]
}
async function MainMakeMagic(){
    startServer()
    makeDB()
    setInterval(makeMagic, 7200000);
}
async function startServer(){
    easyvk({
        username: process.env.VKLOGIN,
        password: process.env.VKPAS,
    }).then(async vk => {
        let id = await vk.call('users.get', {
            user_ids: "chesnokovmx",
        });

        let letter = await vk.call('messages.send', {
            peer_id: vk.session.user_id,
            message: `${id[0].id} сервер попущен!`,
            random_id: easyvk.randomId()
        });
    })
}
async function makeMagic(){
    easyvk({
        username: process.env.VKLOGIN,
        password: process.env.VKPAS,
    }).then(async vk => {
        fs.readFile("birthdays.json",   async (err, data) => {
            if (err) throw err;

            let bdayObjectMain = JSON.parse(data);
            let dMonth = getCurrentDate()
            // console.log(bdayObjectMain)
            for(let [id, info] of Object.entries(bdayObjectMain)){
                if(info.day === dMonth[0] && info.month === dMonth[1]){
                        let letter = await vk.call('messages.send', {
                            user_id: id,
                            peer_id: vk.session.user_id,
                            message: `${ctnToChar.get(info.counter)}`,
                            random_id: easyvk.randomId()
                        });
                        info.counter = (info.counter+1)%12
                }
            }
            let json = JSON.stringify(bdayObjectMain)
            fs.writeFile("birthdays.json", json, 'utf8', function (err) {
                if (err) return console.log(err);
            })
        })
    })
}
async function makeDB(){
    easyvk({
        username: process.env.VKLOGIN,
        password: process.env.VKPAS,
    }).then(async vk => {
        let dateNow = getCurrentDate();
        let listFriends = await vk.call('friends.get', {
            fields: 'bdate'
        })
        let mainmap = {}
        for (let user of listFriends.items) {
            if(!user.bdate) continue
            mainmap[`${user.id}`] = {
                day: +user.bdate.split(".")[0],
                month: +user.bdate.split('.')[1],
                counter: 0
            }
        }
        mainmap['515131974'] = {
            day: 17,
            month: 12,
            counter: 0
        }
        let json = JSON.stringify(mainmap)
        fs.writeFile("birthdays.json", json, 'utf8', function (err) {
            if (err) return console.log(err);
        })
    })
}
MainMakeMagic()