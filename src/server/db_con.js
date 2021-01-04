import lowdb from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
const adapter = new FileSync('./db/db.json')
const db = lowdb(adapter)
db.defaults(
    {   "bed":{
            "number":"",
            "NN":"open",
            "record": "open"
        },
        "data":[
        {
            "type": "NK_ALARM_HIGH",
            "event": [],
            "timesPerDay": 0,
            "timesTotal": 0,
            "timesAvgLength": 0
        },
        {
            "type": "NK_ALARM_MED",
            "event": [],
            "timesPerDay": 0,
            "timesTotal": 0,
            "timesAvgLength": 0
        },
        {
            "type": "NK2_ALARM_HIGH",
            "event": [],
            "timesPerDay": 0,
            "timesTotal": 0,
            "timesAvgLength": 0
        },
        {
            "type": "NK2_ALARM_MED",
            "event": [],
            "timesPerDay": 0,
            "timesTotal": 0,
            "timesAvgLength": 0
        },
        {
            "type": "Breather Alarm",
            "event": [],
            "timesPerDay": 0,
            "timesTotal": 0,
            "timesAvgLength": 0
        },
        {
            "type": "Nurse Bell",
            "event": [],
            "timesPerDay": 0,
            "timesTotal": 0,
            "timesAvgLength": 0
        }
    ]}
).write()


export default db