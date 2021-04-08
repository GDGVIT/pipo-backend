const sequelize = require('../db/db')

async function drop () {
  await sequelize.drop()
  console.log('All tables dropped!')
}

drop()
